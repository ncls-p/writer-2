import { db } from "@/lib/db";
import type {
  ProcessingStatus,
  ProcessingStep,
  UploadProgress,
} from "../../domain/types";

interface GetProcessingStatusInput {
  dataSourceId: string;
}

export async function getProcessingStatus(
  input: GetProcessingStatusInput,
): Promise<UploadProgress | null> {
  const { dataSourceId } = input;

  const dataSource = await db.dataSource.findUnique({
    where: { id: dataSourceId },
    select: {
      id: true,
      status: true,
      progress: true,
      errorMessage: true,
    },
  });

  if (!dataSource) {
    return null;
  }

  return {
    dataSourceId: dataSource.id,
    progress: dataSource.progress,
    status: dataSource.status as ProcessingStatus,
    step: "completed" as ProcessingStep,
    errorMessage: dataSource.errorMessage || undefined,
  };
}
