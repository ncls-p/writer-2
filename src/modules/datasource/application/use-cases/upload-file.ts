import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { DataSourceError } from "../../domain/errors";
import type { JobQueue } from "../ports/job-queue.port";
import type { FileStorage, UploadedFile } from "../ports/storage.port";

interface UploadFileInput {
  userId: string;
  fileName: string;
  data: Buffer;
  mimeType: string;
}

interface UploadFileOutput {
  dataSourceId: string;
  name: string;
}

export async function uploadFile(
  input: UploadFileInput,
  storage: FileStorage,
  queue: JobQueue,
): Promise<UploadFileOutput> {
  const { userId, fileName, data, mimeType } = input;

  try {
    const fileKey = `datasources/${userId}/${randomUUID()}/${fileName}`;

    const uploaded: UploadedFile = await storage.upload(
      userId,
      fileKey,
      data,
      mimeType,
    );

    const dataSource = await db.dataSource.create({
      data: {
        userId,
        name: fileName,
        type: "file",
        status: "pending",
        fileKey: uploaded.key,
        fileName: uploaded.fileName,
        fileSize: uploaded.fileSize,
        mimeType: uploaded.mimeType,
        progress: 0,
      },
    });

    await queue.add("process-document", {
      dataSourceId: dataSource.id,
      userId,
      fileKey: uploaded.key,
    });

    return {
      dataSourceId: dataSource.id,
      name: dataSource.name,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new DataSourceError("Failed to upload file");
  }
}
