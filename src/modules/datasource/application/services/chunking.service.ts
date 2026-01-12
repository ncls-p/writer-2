export interface ChunkingConfig {
  chunkSize: number;
  chunkOverlap: number;
}

export interface ChunkMetadata {
  documentId: string;
  dataSourceId: string;
  position: number;
  totalChunks?: number;
}

export interface TypedChunk {
  content: string;
  metadata: ChunkMetadata;
}

/**
 * Chunks text content into smaller pieces with overlap.
 * Uses a line-based approach to maintain semantic boundaries.
 */
export function chunkContent(
  content: string,
  documentId: string,
  dataSourceId: string,
  config: ChunkingConfig,
): TypedChunk[] {
  const { chunkSize, chunkOverlap } = config;
  const chunks: TypedChunk[] = [];
  const lines = content.split("\n");

  let currentChunk = "";
  let position = 0;

  // Approximate character limit per chunk (tokens ~ chars/4)
  const charLimit = chunkSize * 4;

  for (const line of lines) {
    const potentialChunk = currentChunk + (currentChunk ? "\n" : "") + line;

    if (potentialChunk.length > charLimit && currentChunk.trim()) {
      chunks.push({
        content: currentChunk.trim(),
        metadata: {
          documentId,
          dataSourceId,
          position,
        },
      });
      position++;

      // Calculate overlap
      const overlapChars = chunkOverlap * 4;
      const overlapLines = getOverlapLines(currentChunk, overlapChars);
      currentChunk = overlapLines + (overlapLines ? "\n" : "") + line;
    } else {
      currentChunk = potentialChunk;
    }
  }

  // Add final chunk
  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      metadata: {
        documentId,
        dataSourceId,
        position,
      },
    });
  }

  // Add totalChunks to all chunk metadata
  const totalChunks = chunks.length;
  for (const chunk of chunks) {
    chunk.metadata.totalChunks = totalChunks;
  }

  return chunks;
}

/**
 * Extracts the last N characters worth of lines for overlap.
 */
function getOverlapLines(content: string, targetChars: number): string {
  const lines = content.split("\n");
  let charCount = 0;
  const overlapLines: string[] = [];

  for (let i = lines.length - 1; i >= 0; i--) {
    charCount += lines[i].length + 1;
    overlapLines.unshift(lines[i]);
    if (charCount >= targetChars) {
      break;
    }
  }

  return overlapLines.join("\n");
}
