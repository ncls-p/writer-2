import { getEnv } from "@/lib/env";
import {
  EmbeddingError,
  ParserError,
  ProcessingError,
  VectorStoreError,
} from "../../domain/errors";
import { ProcessingStatus, ProcessingStep } from "../../domain/types";
import type { DataSourceRepository } from "../ports/datasource-repository.port";
import type { DocumentRepository } from "../ports/document-repository.port";
import type { Embedder } from "../ports/embedder.port";
import type { DocumentParser } from "../ports/parser.port";
import type { FileStorage } from "../ports/storage.port";
import type { VectorStore } from "../ports/vector-store.port";
import { chunkContent, type ChunkingConfig } from "../services/chunking.service";
import { embedChunks, storeVectors } from "../services/embedding.service";

export interface ProcessDocumentDeps {
  dataSourceRepo: DataSourceRepository;
  documentRepo: DocumentRepository;
  storage: FileStorage;
  parser: DocumentParser;
  embedder: Embedder;
  vectorStore: VectorStore;
}

export interface ProcessDocumentInput {
  dataSourceId: string;
  userId: string;
  fileKey: string;
}

export interface ProgressCallback {
  (progress: number, status: ProcessingStatus, step: ProcessingStep): Promise<void>;
}

/**
 * Processes a document through parsing, chunking, embedding, and indexing.
 */
export async function processDocument(
  input: ProcessDocumentInput,
  deps: ProcessDocumentDeps,
  onProgress?: ProgressCallback,
): Promise<void> {
  const { dataSourceId, userId, fileKey } = input;
  const { dataSourceRepo, documentRepo, storage, parser, embedder, vectorStore } = deps;

  const updateProgress = async (
    progress: number,
    status: ProcessingStatus,
    step: ProcessingStep,
    errorMessage?: string,
  ) => {
    await dataSourceRepo.update(dataSourceId, {
      progress,
      status,
      errorMessage: errorMessage ?? null,
    });

    if (onProgress) {
      await onProgress(progress, status, step);
    }
  };

  try {
    // Step 1: Download file
    await updateProgress(0, ProcessingStatus.PROCESSING, ProcessingStep.UPLOADING);
    const data = await storage.download(fileKey);

    // Step 2: Parse document
    await updateProgress(20, ProcessingStatus.PROCESSING, ProcessingStep.PARSING);
    let parsed;
    try {
      parsed = await parser.parse(data, "application/octet-stream");
    } catch (error) {
      throw new ParserError(
        `Failed to parse document: ${error instanceof Error ? error.message : "Unknown error"}`,
        ProcessingStep.PARSING,
      );
    }

    const { title, content } = parsed;
    if (!content || content.trim().length === 0) {
      throw new ParserError("Document content is empty", ProcessingStep.PARSING);
    }

    // Step 3: Create document record
    const document = await documentRepo.create({
      dataSourceId,
      title: title ?? null,
      content,
    });

    // Step 4: Chunk content
    await updateProgress(40, ProcessingStatus.PROCESSING, ProcessingStep.CHUNKING);
    const env = getEnv();
    const chunkingConfig: ChunkingConfig = {
      chunkSize: env.CHUNK_SIZE,
      chunkOverlap: env.CHUNK_OVERLAP,
    };
    const chunks = chunkContent(content, document.id, dataSourceId, chunkingConfig);

    // Step 5: Generate embeddings
    await updateProgress(60, ProcessingStatus.PROCESSING, ProcessingStep.EMBEDDING);
    let vectors;
    try {
      vectors = await embedChunks(chunks, userId, embedder);
    } catch (error) {
      throw new EmbeddingError(
        `Failed to generate embeddings: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    // Step 6: Store in vector database
    await updateProgress(80, ProcessingStatus.PROCESSING, ProcessingStep.INDEXING);
    try {
      await storeVectors(vectors, vectorStore);
    } catch (error) {
      throw new VectorStoreError(
        `Failed to store vectors: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    // Step 7: Update final status
    await dataSourceRepo.update(dataSourceId, {
      status: ProcessingStatus.READY,
      progress: 100,
      documentCount: 1,
      chunkCount: chunks.length,
    });

    await updateProgress(100, ProcessingStatus.READY, ProcessingStep.COMPLETED);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    await updateProgress(0, ProcessingStatus.ERROR, ProcessingStep.COMPLETED, errorMessage);

    if (error instanceof ProcessingError) {
      throw error;
    }

    throw new ProcessingError(`Failed to process document: ${errorMessage}`, "processing");
  }
}
