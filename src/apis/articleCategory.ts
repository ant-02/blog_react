import { ArticleCategory } from "../models/articleCategory";
import { ResMsg } from "../templates/msg";
import { http } from "../utils/http";

export const updateArticleCategoryAPI = (articleCategory: ArticleCategory) => {
  return http.request<ResMsg<boolean>>({
    url: "/articleCategory/auth",
    method: "PUT",
    data: articleCategory,
  });
};