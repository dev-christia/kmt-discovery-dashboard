import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Article, ArticlesResponse, CreateArticleData, UpdateArticleData } from "@/types/article";
import { articleApi } from "@/lib/api-article";

interface UseArticlesProps {
  page?: number;
  limit?: number;
  status?: string;
}

export function useArticles({ page = 1, limit = 10, status }: UseArticlesProps = {}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<ArticlesResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchArticles = async () => {
    // @ts-ignore
    if (!session?.accessToken) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // @ts-ignore
      const data = await articleApi.getMyArticles({ page, limit, status }, session.accessToken);
      console.log("API Response:", data);

      let fetchedArticles: Article[] = [];
      let fetchedPagination = null;

      if (Array.isArray(data)) {
        fetchedArticles = data;
      } else if (data?.articles && Array.isArray(data.articles)) {
        fetchedArticles = data.articles;
        fetchedPagination = data.pagination;
      } else if (data?.data?.articles && Array.isArray(data.data.articles)) {
        fetchedArticles = data.data.articles;
        fetchedPagination = data.data.pagination;
      }

      setArticles(fetchedArticles || []);
      setPagination(fetchedPagination || null);
      setPagination(data?.pagination || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      console.error('Error fetching articles:', err);
      // Don't set articles to empty array on error, keep existing data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchArticles();
    }
  }, [session, page, limit, status]);

  const refetch = () => {
    fetchArticles();
  };

  const createArticle = async (data: CreateArticleData): Promise<Article> => {
    try {
      // @ts-ignore
      const newArticle = await articleApi.createArticle(data, session?.accessToken);
      setArticles(prev => [newArticle, ...prev]);
      return newArticle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create article';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateArticle = async (id: string, data: UpdateArticleData): Promise<Article> => {
    try {
      // @ts-ignore
      const updatedArticle = await articleApi.updateArticle(id, data, session?.accessToken);
      setArticles(prev => prev.map(article =>
        article.id === id ? updatedArticle : article
      ));
      return updatedArticle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update article';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteArticle = async (id: string): Promise<void> => {
    try {
      // @ts-ignore
      await articleApi.deleteArticle(id, session?.accessToken);
      setArticles(prev => prev.filter(article => article.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete article';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    articles,
    pagination,
    loading,
    error,
    refetch,
    createArticle,
    updateArticle,
    deleteArticle,
  };
}

export function useArticle(id: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchArticle = async () => {
    if (!session || !id) return;

    setLoading(true);
    setError(null);

    try {
      // For now, we'll fetch from the list and find by id
      // In a real app, you'd have a getArticle endpoint
      // @ts-ignore
      const data = await articleApi.getMyArticles({}, session.accessToken);
      const foundArticle = data.articles.find(a => a.id === id);
      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        throw new Error('Article not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch article');
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [session, id]);

  const updateArticle = async (data: UpdateArticleData): Promise<Article> => {
    try {
      // @ts-ignore
      const updatedArticle = await articleApi.updateArticle(id, data, session?.accessToken);
      setArticle(updatedArticle);
      return updatedArticle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update article';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    article,
    loading,
    error,
    updateArticle,
    refetch: fetchArticle,
  };
}
