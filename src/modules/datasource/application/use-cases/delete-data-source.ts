import { fail, ok, type Result } from "@/lib/result";
import type { DataSourceRepository } from "../ports/datasource-repository.port";
import type { DocumentRepository } from "../ports/document-repository.port";
import type { FileStorage } from "../ports/storage.port";
import type { VectorStore } from "../ports/vector-store.port";

export interface DeleteDataSourceDeps {
  dataSourceRepo: DataSourceRepository;
  documentRepo: DocumentRepository;
  vectorStore: VectorStore;
  storage: FileStorage;
}

export interface DeleteDataSourceInput {
  userId: string;
  dataSourceId: string;
}

export type DeleteDataSourceError = {
  code: "NOT_FOUND" | "STORAGE_ERROR" | "VECTOR_ERROR" | "DATABASE_ERROR";
  message: string;
};

/**
 * Deletes a data source and all associated data.
 * Returns a Result to allow callers to handle errors without try/catch.
 */
export async function deleteDataSource(
  input: DeleteDataSourceInput,
  deps: DeleteDataSourceDeps,
): Promise<Result<void, DeleteDataSourceError>> {
  const { dataSourceId } = input;
  const { dataSourceRepo, documentRepo, vectorStore, storage } = deps;

  const dataSource = await dataSourceRepo.findById(dataSourceId);

  if (!dataSource) {
    return fail({ code: "NOT_FOUND", message: "Data source not found" });
  }

  // Delete file from storage
  if (dataSource.fileKey) {
    try {
      await storage.delete(dataSource.fileKey);
    } catch (error) {
      console.error("Error deleting file from storage:", error);
      // Continue with deletion - storage cleanup is best-effort
    }
  }

  // Delete vectors
  try {
    await vectorStore.initialize();
    await vectorStore.deleteByDataSource(dataSourceId, dataSource.userId);
  } catch (error) {
    console.error("Error deleting vectors:", error);
    // Continue with deletion - vector cleanup is best-effort
  }

  // Delete documents
  try {
    await documentRepo.deleteByDataSourceId(dataSourceId);
  } catch (error) {
    console.error("Error deleting documents:", error);
    return fail({ code: "DATABASE_ERROR", message: "Failed to delete documents" });
  }

  // Delete data source
  try {
    await dataSourceRepo.delete(dataSourceId);
  } catch (error) {
    console.error("Error deleting data source:", error);
    return fail({ code: "DATABASE_ERROR", message: "Failed to delete data source" });
  }

  return ok(undefined);
}
