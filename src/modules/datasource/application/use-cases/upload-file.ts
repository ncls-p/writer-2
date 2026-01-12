import { fail, ok, type Result } from "@/lib/result";
import { randomUUID } from "crypto";
import { DataSourceError } from "../../domain/errors";
import { ProcessingStatus } from "../../domain/types";
import type { DataSourceRepository } from "../ports/datasource-repository.port";
import type { JobQueue } from "../ports/job-queue.port";
import type { FileStorage, UploadedFile } from "../ports/storage.port";

export interface UploadFileDeps {
  dataSourceRepo: DataSourceRepository;
  storage: FileStorage;
  queue: JobQueue;
}

export interface UploadFileInput {
  userId: string;
  fileName: string;
  data: Buffer;
  mimeType: string;
}

export interface UploadFileOutput {
  dataSourceId: string;
  name: string;
}

/**
 * Uploads a file and queues it for processing.
 * Returns a Result to allow callers to handle errors without try/catch.
 */
export async function uploadFile(
  input: UploadFileInput,
  deps: UploadFileDeps,
): Promise<Result<UploadFileOutput, DataSourceError>> {
  const { userId, fileName, data, mimeType } = input;
  const { dataSourceRepo, storage, queue } = deps;

  try {
    const fileKey = `datasources/${userId}/${randomUUID()}/${fileName}`;

    const uploaded: UploadedFile = await storage.upload(
      userId,
      fileKey,
      data,
      mimeType,
    );

    const dataSource = await dataSourceRepo.create({
      userId,
      name: fileName,
      type: "file",
      status: ProcessingStatus.PENDING,
      fileKey: uploaded.key,
      fileName: uploaded.fileName,
      fileSize: uploaded.fileSize,
      mimeType: uploaded.mimeType,
      progress: 0,
    });

    await queue.add("process-document", {
      dataSourceId: dataSource.id,
      userId,
      fileKey: uploaded.key,
    });

    return ok({
      dataSourceId: dataSource.id,
      name: dataSource.name,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return fail(new DataSourceError("Failed to upload file"));
  }
}
