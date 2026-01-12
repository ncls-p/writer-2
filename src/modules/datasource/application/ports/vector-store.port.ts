export interface VectorMetadata {
  documentId: string;
  dataSourceId: string;
  userId: string;
  position: number;
  totalChunks: number;
}

export interface StoredVector {
  id: string;
  vector: number[];
  metadata: VectorMetadata;
}

export interface VectorStore {
  initialize(): Promise<void>;
  store(vectors: StoredVector[]): Promise<void>;
  deleteByDataSource(dataSourceId: string, userId: string): Promise<void>;
  search(
    queryVector: number[],
    userId: string,
    limit: number,
  ): Promise<StoredVector[]>;
}
