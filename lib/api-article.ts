import { Article, CreateArticleData, UpdateArticleData, ArticlesResponse } from '@/types/article';

class ArticleApi {
  private baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/articles`;

  private getAuthHeaders() {
    // This will be called from hooks that have access to session
    return {
      'Content-Type': 'application/json',
    };
  }

  async getMyArticles(
    params?: { page?: number; limit?: number; status?: string },
    accessToken?: string
  ): Promise<ArticlesResponse> {
    const url = new URL(`${this.baseUrl}/me`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const headers: Record<string, string> = this.getAuthHeaders();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url.toString(), {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }
    return response.json();
  }

  async getArticle(id: string, accessToken?: string): Promise<Article> {
    const headers: Record<string, string> = this.getAuthHeaders();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }
    return response.json();
  }

  async createArticle(data: CreateArticleData, accessToken?: string): Promise<Article> {
    const headers: Record<string, string> = this.getAuthHeaders();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create article: ${response.statusText}`);
    }
    return response.json();
  }

  async updateArticle(id: string, data: UpdateArticleData, accessToken?: string): Promise<Article> {
    const headers: Record<string, string> = this.getAuthHeaders();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update article: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteArticle(id: string, accessToken?: string): Promise<void> {
    const headers: Record<string, string> = this.getAuthHeaders();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete article: ${response.statusText}`);
    }
  }

  async uploadImage(articleId: string, file: File, accessToken?: string): Promise<{ id: string; url: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/${articleId}/images`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteImage(articleId: string, imageId: string, accessToken?: string): Promise<void> {
    const headers: Record<string, string> = this.getAuthHeaders();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/${articleId}/images/${imageId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete image: ${response.statusText}`);
    }
  }
}

export const articleApi = new ArticleApi();
