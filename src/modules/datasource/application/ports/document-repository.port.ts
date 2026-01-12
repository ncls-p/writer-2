export interface DocumentEntity {
  id: string;
  dataSourceId: string;
  title: string | null;
  content: string;
  chunkCount: number;
  createdAt: Date;
}

export interface CreateDocumentInput {
  dataSourceId: string;
  title: string | null;
  content: string;
}

export interface DocumentRepository {
  findById(id: string): Promise<DocumentEntity | null>;
  findByDataSourceId(dataSourceId: string): Promise<DocumentEntity[]>;
  create(input: CreateDocumentInput): Promise<DocumentEntity>;
  deleteByDataSourceId(dataSourceId: string): Promise<void>;
}
