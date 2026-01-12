import { z } from "zod";

export const envSchema = z
  .object({
    // Which provider/plugin to use.
    // - openai: OpenAI (may use newer endpoints)
    // - anthropic: Anthropic Messages API
    // - ollama/lmstudio/openai-compatible: OpenAI Chat Completions compatible
    LLM_PLATFORM: z
      .enum(["openai", "anthropic", "ollama", "lmstudio", "openai-compatible"])
      .default("openai"),

    // Base URL for the platform API.
    // Examples:
    // - OpenAI: https://api.openai.com/v1
    // - Ollama: http://localhost:11434/v1
    // - LM Studio: http://localhost:1234/v1
    LLM_API_URL: z.string().url().optional(),

    // Model identifier.
    // Examples:
    // - OpenAI: gpt-4o
    // - Anthropic: claude-3-5-sonnet-latest
    // - Ollama: llama3.1
    LLM_MODEL: z.string().min(1),

    // API key (some platforms accept a dummy key).
    LLM_API_KEY: z.string().min(1),

    // Database
    DATABASE_URL: z.string().url(),

    // Auth
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),

    // GitHub OAuth
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),

    // Embedding
    EMBEDDING_PLATFORM: z
      .enum(["openai", "openai-compatible"])
      .default("openai"),
    EMBEDDING_API_URL: z.string().url().optional(),
    EMBEDDING_MODEL: z.string().min(1),
    EMBEDDING_API_KEY: z.string().min(1),
    EMBEDDING_DIMENSIONS: z.coerce.number().default(1536),

    // Infrastructure
    REDIS_URL: z.string().url(),
    QDRANT_URL: z.string().url(),
    QDRANT_API_KEY: z.string().optional(),
    TIKA_URL: z.string().url(),
    MINIO_ENDPOINT: z.string(),
    MINIO_PORT: z.coerce.number(),
    MINIO_ACCESS_KEY: z.string().min(1),
    MINIO_SECRET_KEY: z.string().min(1),
    MINIO_BUCKET: z.string().min(1),
    MINIO_USE_SSL: z.coerce.boolean().default(false),

    // Chunking
    CHUNK_SIZE: z.coerce.number().default(512),
    CHUNK_OVERLAP: z.coerce.number().default(50),
  })
  .superRefine((values, ctx) => {
    const needsBaseUrl =
      values.LLM_PLATFORM === "ollama" ||
      values.LLM_PLATFORM === "lmstudio" ||
      values.LLM_PLATFORM === "openai-compatible";

    if (needsBaseUrl && !values.LLM_API_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["LLM_API_URL"],
        message: `LLM_API_URL is required for LLM_PLATFORM=${values.LLM_PLATFORM}`,
      });
    }

    const needsEmbeddingBaseUrl =
      values.EMBEDDING_PLATFORM === "openai-compatible";
    if (needsEmbeddingBaseUrl && !values.EMBEDDING_API_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["EMBEDDING_API_URL"],
        message: `EMBEDDING_API_URL is required for EMBEDDING_PLATFORM=${values.EMBEDDING_PLATFORM}`,
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const parsed = envSchema.safeParse({
    LLM_PLATFORM: process.env.LLM_PLATFORM,
    LLM_API_URL: process.env.LLM_API_URL || undefined,
    LLM_MODEL: process.env.LLM_MODEL,
    LLM_API_KEY: process.env.LLM_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    EMBEDDING_PLATFORM: process.env.EMBEDDING_PLATFORM,
    EMBEDDING_API_URL: process.env.EMBEDDING_API_URL || undefined,
    EMBEDDING_MODEL: process.env.EMBEDDING_MODEL,
    EMBEDDING_API_KEY: process.env.EMBEDDING_API_KEY,
    EMBEDDING_DIMENSIONS: process.env.EMBEDDING_DIMENSIONS,
    REDIS_URL: process.env.REDIS_URL,
    QDRANT_URL: process.env.QDRANT_URL,
    QDRANT_API_KEY: process.env.QDRANT_API_KEY || undefined,
    TIKA_URL: process.env.TIKA_URL,
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    MINIO_PORT: process.env.MINIO_PORT,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
    MINIO_BUCKET: process.env.MINIO_BUCKET,
    MINIO_USE_SSL: process.env.MINIO_USE_SSL,
    CHUNK_SIZE: process.env.CHUNK_SIZE,
    CHUNK_OVERLAP: process.env.CHUNK_OVERLAP,
  });

  if (!parsed.success) {
    console.error(
      "Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
