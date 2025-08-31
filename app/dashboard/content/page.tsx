"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  FileText,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Globe,
  Calendar,
  User,
} from "lucide-react";
import { useArticles } from "@/hooks/use-articles";
import { Article, ArticleStatus, CreateArticleData } from "@/types/article";
import ArticleDialog from "@/components/article-dialog";
import { toast } from "sonner";

const statusColors = {
  [ArticleStatus.PUBLISHED]: "bg-green-100 text-green-800",
  [ArticleStatus.DRAFT]: "bg-gray-100 text-gray-800",
  [ArticleStatus.ARCHIVED]: "bg-red-100 text-red-800",
};

export default function ContentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    articles,
    loading,
    error,
    createArticle,
    updateArticle,
    deleteArticle,
    pagination,
  } = useArticles({
    page,
    limit: 10,
    status: selectedStatus === "all" ? undefined : selectedStatus,
  });

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreateArticle = async (data: CreateArticleData) => {
    setSaving(true);
    try {
      await createArticle(data);
      toast.success("Article created successfully");
    } catch (error) {
      toast.error("Failed to create article");
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateArticle = async (data: CreateArticleData) => {
    if (!editingArticle) return;
    setSaving(true);
    try {
      await updateArticle(editingArticle.id, {
        ...data,
        id: editingArticle.id,
      });
      toast.success("Article updated successfully");
    } catch (error) {
      toast.error("Failed to update article");
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteArticle(articleId);
        toast.success("Article deleted successfully");
      } catch (error) {
        toast.error("Failed to delete article");
      }
    }
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setDialogOpen(true);
  };

  const handleNewArticle = () => {
    setEditingArticle(null);
    setDialogOpen(true);
  };

  const totalViews = articles.reduce(
    (sum, article) => sum + article.viewCount,
    0
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Content Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage articles, posts, and content across sectors
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Content Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage articles, posts, and content across sectors
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <p className="text-lg font-medium">Error loading articles</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Content Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage articles, posts, and content across sectors
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleNewArticle}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Articles
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {articles.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    articles.filter((a) => a.status === ArticleStatus.PUBLISHED)
                      .length
                  }
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalViews.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Draft Articles
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    articles.filter((a) => a.status === ArticleStatus.DRAFT)
                      .length
                  }
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={ArticleStatus.DRAFT}>Draft</SelectItem>
                <SelectItem value={ArticleStatus.PUBLISHED}>
                  Published
                </SelectItem>
                <SelectItem value={ArticleStatus.ARCHIVED}>Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Articles ({filteredArticles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <FileText className="w-12 h-12 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No articles found
                          </h3>
                          <p className="text-gray-500 mb-4">
                            {searchTerm || selectedStatus !== "all"
                              ? "Try adjusting your search or filters"
                              : "Get started by creating your first article"}
                          </p>
                          {!searchTerm && selectedStatus === "all" && (
                            <Button onClick={handleNewArticle}>
                              <Plus className="w-4 h-4 mr-2" />
                              Create Your First Article
                            </Button>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map((article) => (
                    <TableRow key={article.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {article.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {article.excerpt}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {article.author?.name || "Unknown Author"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[article.status]}>
                          {article.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            article.accessLevel === "PREMIUM"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {article.accessLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {article.publishedAt
                              ? new Date(
                                  article.publishedAt
                                ).toLocaleDateString()
                              : "Not published"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">
                            {article.viewCount?.toLocaleString() || "0"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditArticle(article)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Article
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Globe className="mr-2 h-4 w-4" />
                              Publish/Unpublish
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteArticle(article.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Article
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
        </CardContent>
      </Card>

      <ArticleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        article={editingArticle}
        onSave={editingArticle ? handleUpdateArticle : handleCreateArticle}
        loading={saving}
      />
    </div>
  );
}
