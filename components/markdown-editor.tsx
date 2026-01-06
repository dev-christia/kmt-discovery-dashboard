"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your article in Markdown...",
  readOnly = false,
}: MarkdownEditorProps) {
  return (
    <Tabs defaultValue="write" className="w-full h-full flex flex-col">
      <TabsList className="mb-4 w-fit">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="write" className="flex-1 mt-0">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[600px] font-mono resize-none focus-visible:ring-1"
          disabled={readOnly}
        />
      </TabsContent>
      <TabsContent value="preview" className="flex-1 mt-0">
        <div className="min-h-[600px] rounded-md border p-6 bg-card text-card-foreground overflow-y-auto">
          <article className="prose prose-stone dark:prose-invert max-w-none">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">Nothing to preview</p>
            )}
          </article>
        </div>
      </TabsContent>
    </Tabs>
  );
}
