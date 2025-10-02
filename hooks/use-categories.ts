"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { categoryApi } from "@/lib/api-category";
import { useToast } from "@/hooks/use-toast";
import type {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types/category";

interface UseCategoriesOptions {
  autoFetch?: boolean;
}

export function useCategories({ autoFetch = true }: UseCategoriesOptions = {}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: session } = useSession();
  const { toast } = useToast();

  const accessToken = useMemo(() => {
    const sessionWithToken = session as any;
    return sessionWithToken?.accessToken as string | undefined;
  }, [session]);

  const withAuthGuard = useCallback(
    async <T,>(handler: () => Promise<T>): Promise<T> => {
      if (!accessToken) {
        const message = "Authentication required";
        setError(message);
        toast({
          variant: "destructive",
          title: "Unauthorized",
          description: message,
        });
        throw new Error(message);
      }

      return handler();
    },
    [accessToken, toast],
  );

  const fetchCategories = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await categoryApi.list(accessToken);
      setCategories(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch categories";
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, [accessToken, toast]);

  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [autoFetch, fetchCategories]);

  const refetch = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = useCallback(
    async (payload: CreateCategoryData) =>
      withAuthGuard(async () => {
        try {
          setCreating(true);
          const category = await categoryApi.create(payload, accessToken);
          setCategories((prev) => [category, ...prev]);
          toast({
            title: "Category Created",
            description: `${category.name} has been added successfully`,
          });
          return category;
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to create category";
          setError(message);
          toast({
            variant: "destructive",
            title: "Error",
            description: message,
          });
          throw err;
        } finally {
          setCreating(false);
        }
      }),
    [accessToken, toast, withAuthGuard],
  );

  const updateCategory = useCallback(
    async (categoryId: string, payload: UpdateCategoryData) =>
      withAuthGuard(async () => {
        try {
          setUpdatingId(categoryId);
          const category = await categoryApi.update(categoryId, payload, accessToken);
          setCategories((prev) => prev.map((item) => (item.id === category.id ? category : item)));
          toast({
            title: "Category Updated",
            description: `${category.name} has been updated`,
          });
          return category;
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to update category";
          setError(message);
          toast({
            variant: "destructive",
            title: "Error",
            description: message,
          });
          throw err;
        } finally {
          setUpdatingId(null);
        }
      }),
    [accessToken, toast, withAuthGuard],
  );

  const deleteCategory = useCallback(
    async (categoryId: string) =>
      withAuthGuard(async () => {
        try {
          setDeletingId(categoryId);
          await categoryApi.delete(categoryId, accessToken);
          setCategories((prev) => prev.filter((item) => item.id !== categoryId));
          toast({
            title: "Category Deleted",
            description: "Category has been removed successfully",
          });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to delete category";
          setError(message);
          toast({
            variant: "destructive",
            title: "Error",
            description: message,
          });
          throw err;
        } finally {
          setDeletingId(null);
        }
      }),
    [accessToken, toast, withAuthGuard],
  );

  const getCategoryByName = useCallback(
    async (name: string) =>
      withAuthGuard(async () => {
        try {
          return await categoryApi.getByName(name, accessToken);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch category";
          setError(message);
          toast({
            variant: "destructive",
            title: "Error",
            description: message,
          });
          throw err;
        }
      }),
    [accessToken, toast, withAuthGuard],
  );

  return {
    categories,
    loading,
    creating,
    updatingId,
    deletingId,
    error,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryByName,
  };
}
