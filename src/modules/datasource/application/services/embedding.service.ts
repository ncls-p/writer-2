import { randomUUID } from "crypto";
import type { Chunk, Embedder } from "../ports/embedder.port";
import type { StoredVector, VectorStore } from "../ports/vector-store.port";
import type { TypedChunk, ChunkMetadata } from "./chunking.service";

export interface EmbeddingConfig {
  batchSize: number;
}

const DEFAULT_CONFIG: EmbeddingConfig = {
  batchSize: 10,
};

/**
 * Generates embeddings for chunks and prepares them for vector storage.
 */
export async function embedChunks(
  chunks: TypedChunk[],
  userId: string,
  embedder: Embedder,
  config: EmbeddingConfig = DEFAULT_CONFIG,
): Promise<StoredVector[]> {
  const vectors: StoredVector[] = [];
  const { batchSize } = config;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);

    // Convert TypedChunk to Chunk for embedder interface
    const embedderChunks: Chunk[] = batch.map((c) => ({
      content: c.content,
      metadata: c.metadata as unknown as Record<string, unknown>,
    }));

    const embeddings = await embedder.embed(embedderChunks);

    for (let j = 0; j < batch.length; j++) {
      const chunkMeta = batch[j].metadata;
      vectors.push({
        id: randomUUID(),
        vector: embeddings[j],
        metadata: {
          documentId: chunkMeta.documentId,
          dataSourceId: chunkMeta.dataSourceId,
          userId,
          position: chunkMeta.position,
          totalChunks: chunkMeta.totalChunks ?? chunks.length,
        },
      });
    }
  }

  return vectors;
}

/**
 * Stores vectors in the vector store.
 */
export async function storeVectors(
  vectors: StoredVector[],
  vectorStore: VectorStore,
): Promise<void> {
  await vectorStore.initialize();
  await vectorStore.store(vectors);
}
