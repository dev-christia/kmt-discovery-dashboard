"use client";

import { ArticleForm } from "../article-form";

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Article</h1>
          <p className="text-muted-foreground">
            Create a new article for your subscribers.
          </p>
        </div>
      </div>
      <div className="p-6 border rounded-md bg-card">
        <ArticleForm />
      </div>
    </div>
  );
}
