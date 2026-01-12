import type { UIMessage } from "ai";
import { ZodError } from "zod";

import { getEnv } from "@/lib/env";
import { streamChatRequestSchema } from "@/lib/openapi/schemas/chat";
import { streamChat } from "@/modules/ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = streamChatRequestSchema.parse(body);

    const env = getEnv();

    const result = await streamChat(messages as UIMessage[], {
      platform: env.LLM_PLATFORM,
      model: env.LLM_MODEL,
      apiKey: env.LLM_API_KEY,
      baseURL: env.LLM_API_URL,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: String(error),
          },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
