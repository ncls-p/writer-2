"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Check,
  Database,
  FileText,
  Github,
  Globe,
  Loader2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";

interface DataSource {
  id: string;
  name: string;
  type: "file" | "github" | "notion" | "website";
  status: "connected" | "syncing" | "error";
  lastSync?: string;
}

const mockDataSources: DataSource[] = [
  {
    id: "1",
    name: "Company Docs",
    type: "file",
    status: "connected",
    lastSync: "2 hours ago",
  },
  {
    id: "2",
    name: "frontend-monorepo",
    type: "github",
    status: "syncing",
    lastSync: "Syncing...",
  },
  {
    id: "3",
    name: "Product Wiki",
    type: "notion",
    status: "connected",
    lastSync: "1 day ago",
  },
];

const sourceTypes = [
  {
    id: "upload",
    label: "Upload Files",
    icon: Upload,
    description: "PDF, DOCX, TXT, MD files",
  },
  {
    id: "github",
    label: "GitHub",
    icon: Github,
    description: "Connect repositories",
  },
  {
    id: "notion",
    label: "Notion",
    icon: FileText,
    description: "Import pages & databases",
  },
  {
    id: "website",
    label: "Website",
    icon: Globe,
    description: "Crawl and index URLs",
  },
];

export function DataSourcesModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dataSources] = useState<DataSource[]>(mockDataSources);

  const getStatusIcon = (status: DataSource["status"]) => {
    switch (status) {
      case "connected":
        return <Check className="h-4 w-4 text-green-500" />;
      case "syncing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "error":
        return <X className="h-4 w-4 text-red-500" />;
    }
  };

  const getTypeIcon = (type: DataSource["type"]) => {
    switch (type) {
      case "file":
        return <FileText className="h-4 w-4" />;
      case "github":
        return <Github className="h-4 w-4" />;
      case "notion":
        return <FileText className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-full border-dashed">
          <Database className="h-4 w-4" />
          Data Sources
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Data Sources</DialogTitle>
          <DialogDescription>
            Connect your data to enable intelligent search and context-aware
            responses.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="sources" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sources">Connected Sources</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="mt-4">
            <ScrollArea className="h-[300px]">
              {dataSources.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Database className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    No data sources connected yet.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Add a source to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {dataSources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {getTypeIcon(source.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {source.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {source.lastSync}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(source.status)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="add" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {sourceTypes.map((type) => (
                <button
                  key={type.id}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-6 transition-all",
                    "hover:border-primary/50 hover:bg-muted/50",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <type.icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{type.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Upload dropzone */}
            <div className="mt-4 rounded-2xl border-2 border-dashed p-8 text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, DOCX, TXT, MD (max 10MB)
              </p>
              <Button variant="secondary" className="mt-4 rounded-full">
                <Plus className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
