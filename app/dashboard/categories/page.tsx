"use client";

import { useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Pencil, Plus, RefreshCw, Trash2, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { useCategories } from "@/hooks/use-categories";
import type { Category } from "@/types/category";

interface CategoryFormState {
  name: string;
  backgroundUrl: string;
  heroText: string;
  welcomeMessage: string;
  keyStats: string;
  callToAction: string;
}

const emptyForm: CategoryFormState = {
  name: "",
  backgroundUrl: "",
  heroText: "",
  welcomeMessage: "",
  keyStats: "",
  callToAction: "",
};

function serializeKeyStats(value: Category["keyStats"]): string {
  if (!value) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch (error) {
    return "";
  }
}

function parseOptionalJson(value: string): Record<string, any> | null {
  if (!value.trim()) return null;

  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error("Key stats must be valid JSON");
  }
}

export default function CategoriesPage() {
  const {
    categories,
    loading,
    error,
    creating,
    updatingId,
    deletingId,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState<CategoryFormState>(emptyForm);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const isProcessing = creating || Boolean(updatingId);

  const categoriesWithMeta = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        formattedUpdatedAt: category.updatedAt
          ? formatDistanceToNow(new Date(category.updatedAt), {
              addSuffix: true,
            })
          : "—",
      })),
    [categories]
  );

  const handleCreate = () => {
    setFormMode("create");
    setActiveCategory(null);
    setFormData(emptyForm);
    setFormError(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setFormMode("edit");
    setActiveCategory(category);
    setFormData({
      name: category.name ?? "",
      backgroundUrl: category.backgroundUrl ?? "",
      heroText: category.heroText ?? "",
      welcomeMessage: category.welcomeMessage ?? "",
      keyStats: serializeKeyStats(category.keyStats),
      callToAction: category.callToAction ?? "",
    });
    setFormError(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setActiveCategory(null);
    setFormData(emptyForm);
    setFormError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError("Name is required");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        backgroundUrl: formData.backgroundUrl.trim() || null,
        heroText: formData.heroText.trim() || null,
        welcomeMessage: formData.welcomeMessage.trim() || null,
        keyStats: parseOptionalJson(formData.keyStats),
        callToAction: formData.callToAction.trim() || null,
      };

      if (formMode === "create") {
        await createCategory(payload);
      } else if (activeCategory) {
        await updateCategory(activeCategory.id, payload);
      }

      closeDialog();
    } catch (submissionError) {
      if (submissionError instanceof Error) {
        setFormError(submissionError.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border border-red-100 bg-gradient-to-r from-red-50 via-rose-50 to-orange-50">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <Badge className="w-fit bg-red-100 text-red-700 border-red-200">
              Categories Hub
            </Badge>
           
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={refetch}
              disabled={loading}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </div>
        </CardHeader>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Unable to load categories</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <Button size="sm" variant="secondary" onClick={refetch}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">
              Total Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-gray-900">
            {categories.length}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">
              Recently Updated
            </CardTitle>
          </CardHeader>
          <CardContent className="text-base text-gray-700">
            {categoriesWithMeta[0]?.formattedUpdatedAt || "—"}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">
              Published Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            Curate your hero messaging, imagery, statistics, and key CTAs per
            category.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              Categories overview
            </CardTitle>
            <CardDescription>
              Manage hero sections, backgrounds, key stats, and calls to action
              for each category.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {loading && categories.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600">
              <Info className="mb-3 h-10 w-10 text-gray-400" />
              <p className="text-lg font-medium">No categories yet</p>
              <p className="mb-6 text-sm text-gray-500">
                Start by creating your first category to highlight unique
                experiences.
              </p>
              <Button
                onClick={handleCreate}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Category
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/6">Name</TableHead>
                    <TableHead className="w-1/5">Hero Text</TableHead>
                    <TableHead className="w-1/4">Welcome Message</TableHead>
                    <TableHead className="w-1/6">Call to Action</TableHead>
                    <TableHead className="w-1/6">Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriesWithMeta.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-semibold text-gray-900">
                        {category.name}
                      </TableCell>
                      <TableCell className="max-w-xs text-sm text-gray-600">
                        {category.heroText || "—"}
                      </TableCell>
                      <TableCell className="max-w-sm text-sm text-gray-600">
                        {category.welcomeMessage || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {category.callToAction || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {category.formattedUpdatedAt}
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                          disabled={
                            Boolean(updatingId) || deletingId === category.id
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                              disabled={
                                deletingId === category.id ||
                                Boolean(updatingId)
                              }
                            >
                              {deletingId === category.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete category
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove{" "}
                                <strong>{category.name}</strong>. Any content
                                linked to this category will no longer display
                                it.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                disabled={deletingId === category.id}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deletingId === category.id}
                                onClick={async () => {
                                  await deleteCategory(category.id);
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            setIsDialogOpen(true);
          } else {
            closeDialog();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create"
                ? "Create category"
                : `Edit ${activeCategory?.name}`}
            </DialogTitle>
            <DialogDescription>
              Configure the visual presentation and messaging for this category.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. Cultural Tours"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backgroundUrl">Background image URL</Label>
                <Input
                  id="backgroundUrl"
                  value={formData.backgroundUrl}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      backgroundUrl: event.target.value,
                    }))
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="heroText">Hero headline</Label>
                <Input
                  id="heroText"
                  value={formData.heroText}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      heroText: event.target.value,
                    }))
                  }
                  placeholder="Introduce the category hero section"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="welcomeMessage">Welcome message</Label>
                <Textarea
                  id="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      welcomeMessage: event.target.value,
                    }))
                  }
                  placeholder="Share a short description or introduction for this category"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="keyStats">Key stats (JSON)</Label>
                <Textarea
                  id="keyStats"
                  value={formData.keyStats}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      keyStats: event.target.value,
                    }))
                  }
                  placeholder='Optional JSON payload, e.g. {"visitors": "50K"}'
                  rows={4}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="callToAction">Primary call to action</Label>
                <Input
                  id="callToAction"
                  value={formData.callToAction}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      callToAction: event.target.value,
                    }))
                  }
                  placeholder="Plan your journey"
                />
              </div>
            </div>

            {formError && (
              <Alert variant="destructive">
                <AlertTitle>Submission error</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="bg-red-600 hover:bg-red-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : formMode === "create" ? (
                  "Create category"
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
