export type Article = {
  id: number;
  title: string;
  content: string;
  summary: string;
  coverImage: string;
  authorId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type ArticleDTO = {
  id: number;
  title: string;
  coverImage: string;
  summary: string;
  updatedAt: string;
};

export type ArticleStatus = "draft" | "published" | "deleted";

export type ArticleCreatePayload = Omit<Article, "id" | "createdAt" | "updatedAt" | "deletedAt">;

export type ArticleUpdatePayload = Partial<ArticleCreatePayload> & {
  id: number;
};

export type ArticleDTOs = {
  articleDTOs: ArticleDTO[];
  count: number;
};
