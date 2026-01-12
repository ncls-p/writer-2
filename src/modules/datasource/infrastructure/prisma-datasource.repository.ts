import { db } from "@/lib/db";
import { ProcessingStatus } from "../domain/types";
import type {
  CreateDataSourceInput,
  DataSourceEntity,
  DataSourceRepository,
  UpdateDataSourceInput,
} from "../application/ports/datasource-repository.port";

export class PrismaDataSourceRepository implements DataSourceRepository {
  async findById(id: string): Promise<DataSourceEntity | null> {
    const record = await db.dataSource.findUnique({ where: { id } });
    if (!record) return null;
    return this.toEntity(record);
  }

  async findByUserId(userId: string): Promise<DataSourceEntity[]> {
    const records = await db.dataSource.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return records.map((r) => this.toEntity(r));
  }

  async create(input: CreateDataSourceInput): Promise<DataSourceEntity> {
    const record = await db.dataSource.create({
      data: {
        userId: input.userId,
        name: input.name,
        type: input.type,
        status: input.status,
        fileKey: input.fileKey,
        fileName: input.fileName,
        fileSize: input.fileSize,
        mimeType: input.mimeType,
        progress: input.progress,
      },
    });
    return this.toEntity(record);
  }

  async update(
    id: string,
    input: UpdateDataSourceInput,
  ): Promise<DataSourceEntity> {
    const record = await db.dataSource.update({
      where: { id },
      data: {
        ...(input.progress !== undefined && { progress: input.progress }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.errorMessage !== undefined && {
          errorMessage: input.errorMessage,
        }),
        ...(input.documentCount !== undefined && {
          documentCount: input.documentCount,
        }),
        ...(input.chunkCount !== undefined && { chunkCount: input.chunkCount }),
      },
    });
    return this.toEntity(record);
  }

  async delete(id: string): Promise<void> {
    await db.dataSource.delete({ where: { id } });
  }

  private toEntity(record: {
    id: string;
    userId: string;
    name: string;
    type: string;
    status: string;
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
  }): DataSourceEntity {
    return {
      id: record.id,
      userId: record.userId,
      name: record.name,
      type: record.type,
      status: record.status as ProcessingStatus,
      progress: record.progress,
      errorMessage: record.errorMessage,
      fileKey: record.fileKey,
      fileName: record.fileName,
      fileSize: record.fileSize,
      mimeType: record.mimeType,
      documentCount: record.documentCount,
      chunkCount: record.chunkCount,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
