export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum AccessLevel {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown content
  excerpt?: string;
  status: ArticleStatus;
  accessLevel: AccessLevel;
  readingTime: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  // categories: Category[]; // Removed dependency
  images: ArticleImage[];
  metadata?: any;
  viewCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleImage {
  id: string;
  articleId: string;
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  altText?: string;
  createdAt: string;
}

export interface ArticlesResponse {
  articles: Article[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalArticles: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateArticleData {
  title: string;
  content: string;
  excerpt?: string;
  status?: ArticleStatus;
  accessLevel?: AccessLevel;
  slug?: string;
}

export interface UpdateArticleData extends Partial<CreateArticleData> {
  id: string;
}

export interface ArticleStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  totalViews: number;
}
