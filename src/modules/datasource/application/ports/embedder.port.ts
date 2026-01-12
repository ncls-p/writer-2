export interface Chunk {
  content: string;
  metadata: Record<string, unknown>;
}

export interface Embedder {
  embed(chunks: Chunk[]): Promise<number[][]>;
}
