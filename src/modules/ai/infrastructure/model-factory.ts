import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModel } from "ai";
import type { ModelConfig } from "../domain/types";

function normalizeBaseURL(platform: ModelConfig["platform"], baseURL?: string) {
  if (!baseURL) return undefined;

  // Ollama and LM Studio typically expose OpenAI-compatible APIs under `/v1`.
  if (
    (platform === "ollama" || platform === "lmstudio") &&
    !baseURL.endsWith("/v1")
  ) {
    return `${baseURL.replace(/\/$/, "")}/v1`;
  }

  return baseURL;
}

function getDefaultBaseURL(platform: ModelConfig["platform"]) {
  if (platform === "ollama") return "http://localhost:11434/v1";
  if (platform === "lmstudio") return "http://localhost:1234/v1";
  return undefined;
}

export function createModel(config: ModelConfig): LanguageModel {
  const { platform, model, apiKey, baseURL } = config;
  const normalizedBaseURL = normalizeBaseURL(platform, baseURL);

  switch (platform) {
    case "anthropic": {
      const anthropic = createAnthropic({
        apiKey,
        ...(normalizedBaseURL && { baseURL: normalizedBaseURL }),
      });
      return anthropic(model);
    }

    case "openai": {
      const openai = createOpenAI({
        apiKey,
        ...(normalizedBaseURL && { baseURL: normalizedBaseURL }),
      });
      return openai(model);
    }

    case "ollama":
    case "lmstudio":
    case "openai-compatible": {
      const compatibleBaseURL: string = (() => {
        const url = normalizedBaseURL ?? getDefaultBaseURL(platform);
        if (!url) {
          throw new Error(
            `Missing baseURL for OpenAI-compatible platform: ${platform}`,
          );
        }
        return url;
      })();

      const provider = createOpenAICompatible({
        name: platform,
        apiKey,
        baseURL: compatibleBaseURL,
      });
      return provider(model);
    }

    default: {
      // Exhaustive check
      const _exhaustive: never = platform;
      return _exhaustive;
    }
  }
}
