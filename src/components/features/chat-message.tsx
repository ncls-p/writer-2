"use client";

import type { UIMessage } from "ai";
import { Sparkles } from "lucide-react";
import { Streamdown } from "streamdown";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: UIMessage;
}

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter(
      (part): part is Extract<typeof part, { type: "text" }> =>
        part.type === "text",
    )
    .map((part) => part.text)
    .join("");
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const content = getMessageText(message);

  return (
    <div
      className={cn(
        "flex gap-4 px-4 py-6",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            "text-xs font-medium",
            isUser
              ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
              : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
          )}
        >
          {isUser ? "JD" : <Sparkles className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn("flex-1 space-y-2", isUser ? "text-right" : "text-left")}
      >
        <div
          className={cn(
            "inline-block rounded-2xl px-4 py-3 text-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted rounded-bl-md",
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <Streamdown>{content}</Streamdown>
          )}
        </div>
      </div>
    </div>
  );
}
