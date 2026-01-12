import type { ProcessingStatus } from "../../domain/types";

export interface DataSourceEntity {
  id: string;
  userId: string;
  name: string;
  type: string;
  status: ProcessingStatus;
  progress: number;
  errorMessage: string | null;
  fileKey: string | null;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  documentCount: number;
  chunkCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDataSourceInput {
  userId: string;
  name: string;
  type: string;
  status: ProcessingStatus;
  fileKey: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  progress: number;
}

export interface UpdateDataSourceInput {
  progress?: number;
  status?: ProcessingStatus;
  errorMessage?: string | null;
  documentCount?: number;
  chunkCount?: number;
}

export interface DataSourceRepository {
  findById(id: string): Promise<DataSourceEntity | null>;
  findByUserId(userId: string): Promise<DataSourceEntity[]>;
  create(input: CreateDataSourceInput): Promise<DataSourceEntity>;
  update(id: string, input: UpdateDataSourceInput): Promise<DataSourceEntity>;
  delete(id: string): Promise<void>;
}
