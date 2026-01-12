import type { DataSourceEntity, DataSourceRepository } from "../ports/datasource-repository.port";

export interface GetDataSourcesInput {
  userId: string;
}

/**
 * Retrieves all data sources for a user.
 */
export async function getDataSources(
  input: GetDataSourcesInput,
  dataSourceRepo: DataSourceRepository,
): Promise<DataSourceEntity[]> {
  const { userId } = input;
  return dataSourceRepo.findByUserId(userId);
}
