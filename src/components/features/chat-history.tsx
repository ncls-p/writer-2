"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  MoreHorizontal,
  PanelLeft,
  PanelLeftClose,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface ChatItem {
  id: string;
  title: string;
  date: string;
}

const mockChats: ChatItem[] = [
  { id: "1", title: "How to implement RAG", date: "Today" },
  { id: "2", title: "Next.js best practices", date: "Today" },
  { id: "3", title: "TypeScript generics explained", date: "Yesterday" },
  { id: "4", title: "Building a chat interface", date: "Yesterday" },
  { id: "5", title: "Docker compose setup", date: "Last week" },
  { id: "6", title: "PostgreSQL optimization", date: "Last week" },
];

interface ChatHistoryProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatHistory({ isOpen, onToggle }: ChatHistoryProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const groupedChats = mockChats.reduce(
    (acc, chat) => {
      if (!acc[chat.date]) {
        acc[chat.date] = [];
      }
      acc[chat.date].push(chat);
      return acc;
    },
    {} as Record<string, ChatItem[]>,
  );

  return (
    <>
      {/* Toggle button when sidebar is closed */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="fixed left-4 top-4 z-50 h-9 w-9 rounded-full"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full bg-muted/50 backdrop-blur-xl transition-all duration-300 ease-in-out",
          isOpen ? "w-72" : "w-0",
        )}
      >
        <div
          className={cn(
            "flex h-full flex-col",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-9 w-9 rounded-full"
            >
              <PanelLeftClose className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Chat list */}
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-4 pb-4">
              {Object.entries(groupedChats).map(([date, chats]) => (
                <div key={date}>
                  <p className="mb-2 px-3 text-xs font-medium text-muted-foreground">
                    {date}
                  </p>
                  <div className="space-y-1">
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        className={cn(
                          "group flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-background/80 cursor-pointer",
                          selectedChat === chat.id && "bg-background",
                        )}
                        onClick={() => setSelectedChat(chat.id)}
                      >
                        <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="flex-1 truncate">{chat.title}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="cursor-pointer">
                              <Pencil className="mr-2 h-4 w-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
