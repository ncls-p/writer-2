// Domain
export { ProcessingStatus, ProcessingStep, SourceType } from "./domain/types";
export type { ChunkMetadata, ChunkWithMetadata, UploadProgress } from "./domain/types";
export {
  DataSourceError,
  EmbeddingError,
  ParserError,
  ProcessingError,
  StorageError,
  VectorStoreError,
} from "./domain/errors";

// Application - Use Cases
export { deleteDataSource, type DeleteDataSourceDeps, type DeleteDataSourceInput, type DeleteDataSourceError } from "./application/use-cases/delete-data-source";
export { getDataSources, type GetDataSourcesInput } from "./application/use-cases/get-data-sources";
export { getProcessingStatus, type GetProcessingStatusInput } from "./application/use-cases/get-processing-status";
export { processDocument, type ProcessDocumentDeps, type ProcessDocumentInput, type ProgressCallback } from "./application/use-cases/process-document";
export { uploadFile, type UploadFileDeps, type UploadFileInput, type UploadFileOutput } from "./application/use-cases/upload-file";

// Application - Ports
export type { DataSourceEntity, DataSourceRepository, CreateDataSourceInput, UpdateDataSourceInput } from "./application/ports/datasource-repository.port";
export type { DocumentEntity, DocumentRepository, CreateDocumentInput } from "./application/ports/document-repository.port";
export type { Chunk, Embedder } from "./application/ports/embedder.port";
export type { JobQueue } from "./application/ports/job-queue.port";
export type { DocumentParser, ParsedDocument } from "./application/ports/parser.port";
export type { FileStorage, UploadedFile } from "./application/ports/storage.port";
export type { StoredVector, VectorMetadata, VectorStore } from "./application/ports/vector-store.port";

// Application - Services
export { chunkContent, type ChunkingConfig, type TypedChunk } from "./application/services/chunking.service";
export { embedChunks, storeVectors, type EmbeddingConfig } from "./application/services/embedding.service";

// Infrastructure
export { PrismaDataSourceRepository } from "./infrastructure/prisma-datasource.repository";
export { PrismaDocumentRepository } from "./infrastructure/prisma-document.repository";
