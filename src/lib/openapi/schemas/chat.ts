import { z } from "zod";

export const messageRoleSchema = z.enum(["system", "user", "assistant"]);

/**
 * Schema for text parts in a message.
 */
export const textPartSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

/**
 * Schema for tool call parts in a message.
 */
export const toolCallPartSchema = z.object({
  type: z.literal("tool-call"),
  toolCallId: z.string(),
  toolName: z.string(),
  args: z.record(z.string(), z.unknown()),
});

/**
 * Schema for tool result parts in a message.
 */
export const toolResultPartSchema = z.object({
  type: z.literal("tool-result"),
  toolCallId: z.string(),
  result: z.unknown(),
});

/**
 * Union of all possible message parts.
 */
export const messagePartSchema = z.discriminatedUnion("type", [
  textPartSchema,
  toolCallPartSchema,
  toolResultPartSchema,
]);

/**
 * Schema for UIMessage-compatible chat messages.
 */
export const chatMessageSchema = z.object({
  id: z.string(),
  role: messageRoleSchema,
  parts: z.array(messagePartSchema),
  createdAt: z.coerce.date().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const streamChatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1, "At least one message is required"),
});

export const streamChatResponseSchema = z.object({
  id: z.string(),
  role: z.enum(["assistant", "user", "system"]),
  parts: z.array(messagePartSchema),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type MessagePart = z.infer<typeof messagePartSchema>;
export type StreamChatRequest = z.infer<typeof streamChatRequestSchema>;
export type StreamChatResponse = z.infer<typeof streamChatResponseSchema>;
