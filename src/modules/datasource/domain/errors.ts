export class DataSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataSourceError";
  }
}

export class ProcessingError extends Error {
  constructor(
    message: string,
    public readonly step?: string,
  ) {
    super(message);
    this.name = "ProcessingError";
  }
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

export class ParserError extends Error {
  constructor(
    message: string,
    public readonly step?: string,
  ) {
    super(message);
    this.name = "ParserError";
  }
}

export class EmbeddingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmbeddingError";
  }
}

export class VectorStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VectorStoreError";
  }
}
