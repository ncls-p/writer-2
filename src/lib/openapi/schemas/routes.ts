import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { registry } from "../registry";
import { streamChatRequestSchema, streamChatResponseSchema } from "./chat";

extendZodWithOpenApi(z);

registry.registerPath({
  method: "post",
  path: "/api/v1/chat",
  summary: "Stream chat response",
  description: "Send messages and receive a streaming response from the LLM",
  request: {
    body: {
      content: {
        "application/json": {
          schema: streamChatRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful streaming response",
      content: {
        "text/event-stream": {
          schema: streamChatResponseSchema,
        },
      },
    },
    400: {
      description: "Bad request - invalid input",
      content: {
        "application/json": {
          schema: z.object({
            error: z.object({
              code: z.string(),
              message: z.string(),
              details: z.any().optional(),
            }),
          }),
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: z.object({
            error: z.object({
              code: z.string(),
              message: z.string(),
              details: z.any().optional(),
            }),
          }),
        },
      },
    },
  },
  tags: ["Chat"],
});
