import { db } from "@/lib/db";

interface GetDataSourcesInput {
  userId: string;
}

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: string;
  progress: number;
  errorMessage: string | null;
  fileName: string | null;
  fileSize: number | null;
  documentCount: number;
  chunkCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getDataSources(
  input: GetDataSourcesInput,
): Promise<DataSource[]> {
  const { userId } = input;

  return db.dataSource.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  }) as unknown as DataSource[];
}
