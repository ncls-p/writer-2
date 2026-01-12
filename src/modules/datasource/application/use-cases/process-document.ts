import { db } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { randomUUID } from "crypto";
import {
  EmbeddingError,
  ParserError,
  ProcessingError,
  VectorStoreError,
} from "../../domain/errors";
import type {
  ChunkMetadata,
  ProcessingStatus,
  ProcessingStep,
  UploadProgress,
} from "../../domain/types";
import type { Chunk, Embedder } from "../ports/embedder.port";
import type { DocumentParser } from "../ports/parser.port";
import type { FileStorage } from "../ports/storage.port";
import type { StoredVector, VectorStore } from "../ports/vector-store.port";

interface ProcessDocumentInput {
  dataSourceId: string;
  userId: string;
  fileKey: string;
  onProgress?: (progress: UploadProgress) => Promise<void>;
}

export async function processDocument(
  input: ProcessDocumentInput,
  storage: FileStorage,
  parser: DocumentParser,
  embedder: Embedder,
  vectorStore: VectorStore,
  onProgress?: (progress: UploadProgress) => Promise<void>,
): Promise<void> {
  const { dataSourceId, userId, fileKey } = input;

  const updateProgress = async (
    progress: number,
    status: ProcessingStatus,
    step: ProcessingStep,
    errorMessage?: string,
  ) => {
    await db.dataSource.update({
      where: { id: dataSourceId },
      data: { progress, status, errorMessage },
    });

    if (onProgress) {
      await onProgress({
        dataSourceId,
        progress,
        status,
        step,
        errorMessage,
      });
    }
  };

  try {
    await updateProgress(
      0,
      "processing" as ProcessingStatus,
      "uploading" as ProcessingStep,
    );

    const data = await storage.download(fileKey);

    await updateProgress(
      20,
      "processing" as ProcessingStatus,
      "parsing" as ProcessingStep,
    );

    let parsed;
    try {
      parsed = await parser.parse(data, "application/octet-stream");
    } catch (error) {
      throw new ParserError(
        `Failed to parse document: ${error instanceof Error ? error.message : "Unknown error"}`,
        "parsing",
      );
    }

    const { title, content } = parsed;

    if (!content || content.trim().length === 0) {
      throw new ParserError("Document content is empty", "parsing");
    }

    const document = await db.document.create({
      data: {
        dataSourceId,
        title,
        content,
      },
    });

    await updateProgress(
      40,
      "processing" as ProcessingStatus,
      "chunking" as ProcessingStep,
    );

    const chunks = await chunkContent(content, document.id, dataSourceId);

    await updateProgress(
      60,
      "processing" as ProcessingStatus,
      "embedding" as ProcessingStep,
    );

    const vectors: StoredVector[] = [];
    const batchSize = 10;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);

      let embeddings;
      try {
        embeddings = await embedder.embed(batch);
      } catch (error) {
        throw new EmbeddingError(
          `Failed to generate embeddings: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }

      for (let j = 0; j < batch.length; j++) {
        const chunkMetadata = batch[j].metadata as unknown as ChunkMetadata;
        vectors.push({
          id: randomUUID(),
          vector: embeddings[j],
          metadata: {
            documentId: document.id,
            dataSourceId,
            userId,
            position: chunkMetadata.position,
            totalChunks: chunkMetadata.totalChunks,
          },
        });
      }
    }

    await updateProgress(
      80,
      "processing" as ProcessingStatus,
      "indexing" as ProcessingStep,
    );

    try {
      await vectorStore.initialize();
      await vectorStore.store(vectors);
    } catch (error) {
      throw new VectorStoreError(
        `Failed to store vectors: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    await db.dataSource.update({
      where: { id: dataSourceId },
      data: {
        status: "ready",
        progress: 100,
        documentCount: 1,
        chunkCount: chunks.length,
      },
    });

    await updateProgress(
      100,
      "ready" as ProcessingStatus,
      "completed" as ProcessingStep,
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    await updateProgress(
      0,
      "error" as ProcessingStatus,
      "completed" as ProcessingStep,
      errorMessage,
    );

    if (error instanceof ProcessingError) {
      throw error;
    }

    throw new ProcessingError(
      `Failed to process document: ${errorMessage}`,
      "processing",
    );
  }
}

async function chunkContent(
  content: string,
  documentId: string,
  dataSourceId: string,
): Promise<Chunk[]> {
  const { CHUNK_SIZE, CHUNK_OVERLAP } = getEnv();

  const chunks: Chunk[] = [];
  const lines = content.split("\n");

  let currentChunk = "";
  let position = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if ((currentChunk + "\n" + line).length > CHUNK_SIZE * 4) {
      if (currentChunk.trim().length > 0) {
        chunks.push({
          content: currentChunk.trim(),
          metadata: {
            documentId,
            dataSourceId,
            position,
          },
        });
        position++;
      }

      const overlapSize = Math.floor(CHUNK_OVERLAP * 4);
      const overlapLines = currentChunk
        .split("\n")
        .slice(-Math.ceil(overlapLinesCount(currentChunk, overlapSize)));
      currentChunk = overlapLines.join("\n") + "\n" + line;
    } else {
      currentChunk += (currentChunk.length > 0 ? "\n" : "") + line;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      content: currentChunk.trim(),
      metadata: {
        documentId,
        dataSourceId,
        position,
      },
    });
  }

  for (const chunk of chunks) {
    (chunk.metadata as unknown as ChunkMetadata).totalChunks = chunks.length;
  }

  return chunks;
}

function overlapLinesCount(content: string, targetChars: number): number {
  const lines = content.split("\n");
  let charCount = 0;
  for (let i = lines.length - 1; i >= 0; i--) {
    charCount += lines[i].length + 1;
    if (charCount >= targetChars) {
      return lines.length - i;
    }
  }
  return lines.length;
}
