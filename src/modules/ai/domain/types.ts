export type LLMPlatform =
  | "openai"
  | "anthropic"
  | "ollama"
  | "lmstudio"
  | "openai-compatible";

export interface ModelConfig {
  platform: LLMPlatform;
  model: string;
  apiKey: string;
  baseURL?: string;
}

export const SYSTEM_PROMPT = `You are Writer, an intelligent AI assistant.
You help users with research, writing, and answering questions.
Be concise, helpful, and accurate. Format your responses with markdown when appropriate.`;
