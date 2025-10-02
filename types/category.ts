export interface Category {
  id: string;
  name: string;
  backgroundUrl?: string | null;
  heroText?: string | null;
  welcomeMessage?: string | null;
  keyStats?: Record<string, any> | null;
  callToAction?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryData {
  name: string;
  backgroundUrl?: string | null;
  heroText?: string | null;
  welcomeMessage?: string | null;
  keyStats?: Record<string, any> | null;
  callToAction?: string | null;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}
