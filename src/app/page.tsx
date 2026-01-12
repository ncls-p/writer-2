"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ChatHistory } from "@/components/features/chat-history";
import { ChatInput } from "@/components/features/chat-input";
import { ChatMessage } from "@/components/features/chat-message";
import { DataSourcesModal } from "@/components/features/data-sources-modal";
import { UserMenu } from "@/components/features/user-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoadingDots } from "@/components/ui/loading-dots";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What's trending in AI this week?",
  "Summarize my latest documents",
  "Help me write a blog post",
  "Research competitor analysis",
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/v1/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (content: string) => {
    sendMessage({ text: content });
  };

  return (
    <div className="flex h-screen bg-background">
      <ChatHistory
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          sidebarOpen ? "ml-72" : "ml-0",
        )}
      >
        <header className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className={cn(sidebarOpen ? "w-0" : "w-12")} />
            <DataSourcesModal />
          </div>
          <UserMenu />
        </header>

        <main className="flex flex-1 flex-col overflow-hidden">
          {!hasMessages ? (
            <EmptyState
              onSuggestionClick={handleSendMessage}
              onSend={handleSendMessage}
            />
          ) : (
            <>
              <ScrollArea className="flex-1" ref={scrollRef}>
                <div className="mx-auto max-w-3xl">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isLoading && <LoadingIndicator />}
                </div>
              </ScrollArea>

              <div className="border-t bg-background p-4">
                <ChatInput onSend={handleSendMessage} disabled={isLoading} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
  onSend: (message: string) => void;
}

function EmptyState({ onSuggestionClick, onSend }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-semibold">How can I help you today?</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Ask me anything. I can search your documents, research the web, and
          help you create content.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="rounded-full border bg-background px-4 py-2 text-sm transition-colors hover:bg-muted"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <ChatInput onSend={onSend} />
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex gap-4 px-4 py-6">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <Sparkles className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="inline-block rounded-2xl rounded-bl-md bg-muted px-4 py-3">
          <LoadingDots className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
