"use client";

import { useArticles } from "@/hooks/use-articles";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Plus, Loader2, MoreHorizontal, Trash, Eye, CreditCard, Edit } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { articleApi } from "@/lib/api-article";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FounderArticlesPage() {
  const { articles, loading, error, refetch } = useArticles();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    // @ts-ignore
    if (!session?.accessToken) return;

    if (!confirm("Are you sure you want to delete this article?")) return;

    setDeletingId(id);
    try {
      // @ts-ignore
      await articleApi.deleteArticle(id, session.accessToken);
      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted.",
      });
      refetch();
    } catch (error) {
       toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (slug: string) => {
      // Assuming public route is /articles/:slug
      window.open(`/articles/${slug}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive p-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Founder Articles</h1>
        <Link href="/dashboard/founder/articles/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </Link>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No articles found. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        article.status === "PUBLISHED" ? "default" : "secondary"
                      }
                    >
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{article.accessLevel}</Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(article.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/founder/articles/${article.id}`)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleView(article.slug)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                           <CreditCard className="w-4 h-4 mr-2" />
                           Subscriptions
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={() => handleDelete(article.id)}
                            className="text-destructive focus:text-destructive"
                            disabled={deletingId === article.id}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
