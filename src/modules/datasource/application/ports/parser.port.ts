export interface ParsedDocument {
  title?: string;
  content: string;
}

export interface DocumentParser {
  parse(data: Buffer, mimeType: string): Promise<ParsedDocument>;
}
