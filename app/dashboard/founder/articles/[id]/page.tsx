"use client";

import { useParams } from "next/navigation";
import { useArticle } from "@/hooks/use-article";
import { ArticleForm } from "../article-form";
import { Loader2 } from "lucide-react";

export default function EditArticlePage() {
  const params = useParams<{ id: string }>();
  const { article, loading, error } = useArticle(params.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-destructive p-4">
        Error: {error || "Article not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Article</h1>
          <p className="text-muted-foreground">Make changes to your article.</p>
        </div>
      </div>
      <div className="p-6 border rounded-md bg-card">
        <ArticleForm initialData={article} />
      </div>
    </div>
  );
}
