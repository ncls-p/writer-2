import { db } from "@/lib/db";
import type { FileStorage } from "../ports/storage.port";
import type { VectorStore } from "../ports/vector-store.port";

interface DeleteDataSourceInput {
  userId: string;
  dataSourceId: string;
  vectorStore: VectorStore;
  storage: FileStorage;
}

export async function deleteDataSource(
  input: DeleteDataSourceInput,
): Promise<void> {
  const { userId, dataSourceId, vectorStore, storage } = input;

  const dataSource = await db.dataSource.findUnique({
    where: { id: dataSourceId },
    select: { fileKey: true },
  });

  if (!dataSource) {
    return;
  }

  if (dataSource.fileKey) {
    await storage.delete(dataSource.fileKey);
  }

  try {
    await vectorStore.initialize();
    await vectorStore.deleteByDataSource(dataSourceId, userId);
  } catch (error) {
    console.error("Error deleting vectors:", error);
  }

  await db.dataSource.delete({
    where: { id: dataSourceId },
  });
}
