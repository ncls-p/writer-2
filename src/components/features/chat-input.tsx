"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Paperclip, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Message Writer...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div
        className={cn(
          "relative flex items-end gap-2 rounded-3xl border bg-background p-2 shadow-lg transition-all",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "opacity-50",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-full"
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5 text-muted-foreground" />
        </Button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground",
            "min-h-[40px] max-h-[200px]",
          )}
        />

        <Button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          size="icon"
          className={cn(
            "h-9 w-9 shrink-0 rounded-full transition-all",
            value.trim()
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Writer can make mistakes. Consider checking important information.
      </p>
    </div>
  );
}
