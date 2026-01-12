export interface JobQueue {
  add(name: string, data: unknown): Promise<void>;
}
