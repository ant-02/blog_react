import { Article, ArticleDTO, ArticleDTOs } from "../models/article";
import { ResMsg } from "../templates/msg";
import { http } from "../utils/http";

export const fetchArticleAPI = (id: string) => {
  return http.request<ResMsg<Article>>({
    url: "/article/" + id,
    method: "GET",
  });
};

export const fetchArticleDTOsByCategoryIdAPI = (id: string, count: string) => {
  return http.request<ResMsg<ArticleDTO[]>>({
    url: "/article/dtos/categoryId/" + id + "/" + count,
    method: "GET",
  });
};

export const fetchArticleDTOsByKeywordsAPI = (keywords: string) => {
  return http.request<ResMsg<ArticleDTO[]>>({
    url: "/article/dtos/keywords/" + keywords,
    method: "GET",
  });
};

export const fetchArticleDTOsByUserIdAPI = (
  userId: string,
  page: string,
  pageSize: string,
  status: string
) => {
  return http.request<ResMsg<ArticleDTOs>>({
    url: "/article/dtos/userId/" + userId + "/" + page + "/" + pageSize + "/" + status,
    method: "GET",
  });
};

export const updateArticleByIdAPI = (article: Article) => {
  return http.request<ResMsg<boolean>>({
    url: "/article/auth",
    method: "PUT",
    data: article,
  });
};

export const insertArticle = (article: Article) => {
  return http.request<ResMsg<boolean>>({
    url: "/article/auth",
    method: "POST",
    data: article,
  });
};
