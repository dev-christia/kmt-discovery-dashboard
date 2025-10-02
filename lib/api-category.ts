import { Category, CreateCategoryData, UpdateCategoryData } from "@/types/category";

class CategoryApi {
  private baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

  private getHeaders(accessToken?: string, includeJson: boolean = true) {
    const headers: Record<string, string> = {};

    if (includeJson) {
      headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let message = `Request failed: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.json();
        if (errorBody?.message) {
          message = errorBody.message;
        }
      } catch (error) {
        // ignore json parse errors
      }
      throw new Error(message);
    }

    try {
      return (await response.json()) as T;
    } catch (error) {
      throw new Error("Unable to parse server response");
    }
  }

  private normalizeCategory(payload: any): Category {
    if (!payload) {
      throw new Error("Category data is empty");
    }

    if (payload.data && !payload.id) {
      return this.normalizeCategory(payload.data);
    }

    return payload as Category;
  }

  private normalizeCategoryList(payload: any): Category[] {
    if (Array.isArray(payload)) {
      return payload as Category[];
    }

    if (Array.isArray(payload?.data)) {
      return payload.data as Category[];
    }

    if (Array.isArray(payload?.data?.categories)) {
      return payload.data.categories as Category[];
    }

    if (Array.isArray(payload?.categories)) {
      return payload.categories as Category[];
    }

    return [];
  }

  async list(accessToken?: string): Promise<Category[]> {
    const response = await fetch(this.baseUrl, {
      headers: this.getHeaders(accessToken),
    });

    const payload = await this.handleResponse<any>(response);
    return this.normalizeCategoryList(payload);
  }

  async create(data: CreateCategoryData, accessToken?: string): Promise<Category> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: this.getHeaders(accessToken),
      body: JSON.stringify(data),
    });

    const payload = await this.handleResponse<any>(response);
    return this.normalizeCategory(payload);
  }

  async update(categoryId: string, data: UpdateCategoryData, accessToken?: string): Promise<Category> {
    const response = await fetch(`${this.baseUrl}/${categoryId}`, {
      method: "PUT",
      headers: this.getHeaders(accessToken),
      body: JSON.stringify(data),
    });

    const payload = await this.handleResponse<any>(response);
    return this.normalizeCategory(payload);
  }

  async delete(categoryId: string, accessToken?: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${categoryId}`, {
      method: "DELETE",
      headers: this.getHeaders(accessToken, false),
    });

    await this.handleResponse<any>(response);
  }

  async getByName(name: string, accessToken?: string): Promise<Category | null> {
    const response = await fetch(`${this.baseUrl}/${encodeURIComponent(name)}`, {
      headers: this.getHeaders(accessToken),
    });

    if (response.status === 404) {
      return null;
    }

    const payload = await this.handleResponse<any>(response);
    return this.normalizeCategory(payload);
  }
}

export const categoryApi = new CategoryApi();
