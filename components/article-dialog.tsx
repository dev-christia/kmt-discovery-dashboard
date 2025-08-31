"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import Editor from "./editor";
import {
  Article,
  ArticleStatus,
  AccessLevel,
  CreateArticleData,
} from "@/types/article";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  excerpt: z.string().max(500, "Excerpt too long").optional(),
  status: z.nativeEnum(ArticleStatus).optional(),
  accessLevel: z.nativeEnum(AccessLevel).optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: Article | null;
  onSave: (data: CreateArticleData) => Promise<void>;
  loading?: boolean;
}

export default function ArticleDialog({
  open,
  onOpenChange,
  article,
  onSave,
  loading = false,
}: ArticleDialogProps) {
  const [content, setContent] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      status: ArticleStatus.DRAFT,
      accessLevel: AccessLevel.FREE,
    },
  });

  const watchedStatus = watch("status");
  const watchedAccessLevel = watch("accessLevel");

  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        excerpt: article.excerpt || "",
        status: article.status,
        accessLevel: article.accessLevel,
      });
      setContent(article.content);
      setCategories(article.categories?.map((c) => c.name) || []);
    } else {
      reset({
        title: "",
        excerpt: "",
        status: ArticleStatus.DRAFT,
        accessLevel: AccessLevel.FREE,
      });
      setContent(null);
      setCategories([]);
    }
  }, [article, reset]);

  const onSubmit = async (data: ArticleFormData) => {
    try {
      await onSave({
        ...data,
        content,
        categories,
      });
      onOpenChange(false);
      reset();
      setContent(null);
      setCategories([]);
    } catch (error) {
      console.error("Failed to save article:", error);
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const removeCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category));
  };

  const handleContentChange = (data: any) => {
    setContent(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? "Edit Article" : "Create New Article"}
          </DialogTitle>
          <DialogDescription>
            {article
              ? "Update your article content and settings."
              : "Write a new article for your audience."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter article title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt (Optional)</Label>
              <Textarea
                id="excerpt"
                {...register("excerpt")}
                placeholder="Brief description of the article"
                rows={3}
                className={errors.excerpt ? "border-red-500" : ""}
              />
              {errors.excerpt && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.excerpt.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={watchedStatus}
                  onValueChange={(value) =>
                    setValue("status", value as ArticleStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ArticleStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={ArticleStatus.PUBLISHED}>
                      Published
                    </SelectItem>
                    <SelectItem value={ArticleStatus.ARCHIVED}>
                      Archived
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Access Level</Label>
                <Select
                  value={watchedAccessLevel}
                  onValueChange={(value) =>
                    setValue("accessLevel", value as AccessLevel)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AccessLevel.FREE}>Free</SelectItem>
                    <SelectItem value={AccessLevel.PREMIUM}>Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Categories</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add category"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCategory())
                  }
                />
                <Button type="button" onClick={addCategory} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {category}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeCategory(category)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Content</Label>
              <div className="border rounded-md p-4 min-h-[400px]">
                <Editor
                  data={content}
                  onChange={handleContentChange}
                  placeholder="Start writing your article..."
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : article
                ? "Update Article"
                : "Create Article"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
