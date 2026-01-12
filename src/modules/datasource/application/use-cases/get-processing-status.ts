import { ProcessingStatus, ProcessingStep } from "../../domain/types";
import type { UploadProgress } from "../../domain/types";
import type { DataSourceRepository } from "../ports/datasource-repository.port";

export interface GetProcessingStatusInput {
  dataSourceId: string;
}

/**
 * Retrieves the processing status for a data source.
 */
export async function getProcessingStatus(
  input: GetProcessingStatusInput,
  dataSourceRepo: DataSourceRepository,
): Promise<UploadProgress | null> {
  const { dataSourceId } = input;

  const dataSource = await dataSourceRepo.findById(dataSourceId);

  if (!dataSource) {
    return null;
  }

  return {
    dataSourceId: dataSource.id,
    progress: dataSource.progress,
    status: dataSource.status,
    step: ProcessingStep.COMPLETED,
    errorMessage: dataSource.errorMessage ?? undefined,
  };
}
