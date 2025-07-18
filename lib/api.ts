import dotenv from "dotenv"
dotenv.config()
export class ApiClient {
  private static async getAuthHeaders() {
    // In a real app, you'd get the token from your auth system
    // For now, we'll simulate it
    return {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || "demo-token"}`,
      "Content-Type": "application/json",
    }
  }

  static async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${process.env.API_URL}/invitations${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString())
        }
      })
    }

    const headers = await this.getAuthHeaders()
    const response = await fetch(url.toString(), { headers })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${process.env.API_URL}/invitations${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  static async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders()
    const response = await fetch(`${process.env.API_URL}/invitations${endpoint}`, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}
