import { z } from "zod";

export const messageRoleSchema = z.enum(["system", "user", "assistant"]);

export const chatMessageSchema = z.object({
  id: z.string(),
  role: messageRoleSchema,
  parts: z.array(z.any()),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const streamChatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1, "At least one message is required"),
});

export const streamChatResponseSchema = z.object({
  id: z.string(),
  role: z.enum(["assistant", "user", "system"]),
  parts: z.array(z.any()),
});
