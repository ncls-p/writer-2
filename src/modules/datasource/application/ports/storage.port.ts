export interface UploadedFile {
  key: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface FileStorage {
  upload(
    userId: string,
    fileName: string,
    data: Buffer,
    mimeType: string,
  ): Promise<UploadedFile>;

  delete(key: string): Promise<void>;

  download(key: string): Promise<Buffer>;
}
