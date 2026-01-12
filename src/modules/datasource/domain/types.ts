export enum SourceType {
  FILE = "file",
  GITHUB = "github",
  NOTION = "notion",
  WEBSITE = "website",
}

export enum ProcessingStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  READY = "ready",
  ERROR = "error",
}

export enum ProcessingStep {
  UPLOADING = "uploading",
  PARSING = "parsing",
  CHUNKING = "chunking",
  EMBEDDING = "embedding",
  INDEXING = "indexing",
  COMPLETED = "completed",
}

export interface ChunkMetadata {
  position: number;
  totalChunks: number;
  documentId: string;
  dataSourceId: string;
}

export interface ChunkWithMetadata {
  content: string;
  metadata: ChunkMetadata;
}

export interface UploadProgress {
  dataSourceId: string;
  progress: number;
  status: ProcessingStatus;
  step: ProcessingStep;
  errorMessage?: string;
}
