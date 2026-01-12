import { db } from "@/lib/db";
import type {
  CreateDocumentInput,
  DocumentEntity,
  DocumentRepository,
} from "../application/ports/document-repository.port";

export class PrismaDocumentRepository implements DocumentRepository {
  async findById(id: string): Promise<DocumentEntity | null> {
    const record = await db.document.findUnique({ where: { id } });
    if (!record) return null;
    return this.toEntity(record);
  }

  async findByDataSourceId(dataSourceId: string): Promise<DocumentEntity[]> {
    const records = await db.document.findMany({
      where: { dataSourceId },
      orderBy: { createdAt: "desc" },
    });
    return records.map((r) => this.toEntity(r));
  }

  async create(input: CreateDocumentInput): Promise<DocumentEntity> {
    const record = await db.document.create({
      data: {
        dataSourceId: input.dataSourceId,
        title: input.title,
        content: input.content,
      },
    });
    return this.toEntity(record);
  }

  async deleteByDataSourceId(dataSourceId: string): Promise<void> {
    await db.document.deleteMany({ where: { dataSourceId } });
  }

  private toEntity(record: {
    id: string;
    dataSourceId: string;
    title: string | null;
    content: string;
    chunkCount: number;
    createdAt: Date;
  }): DocumentEntity {
    return {
      id: record.id,
      dataSourceId: record.dataSourceId,
      title: record.title,
      content: record.content,
      chunkCount: record.chunkCount,
      createdAt: record.createdAt,
    };
  }
}
