import { Category } from "../models/category";
import { ResMsg } from "../templates/msg";
import { http } from "../utils/http";

export const fetchCategoriesAPI = () => {
  return http.request<ResMsg<Category[]>>({
    url: "/category/all",
    method: "GET",
  });
};

export const fetchCategoryByArticleIdAPI = (id: string) => {
  return http.request<ResMsg<number>>({
    url: "/articleCategory/categoryId/" + id,
    method: "GET",
  });
};
