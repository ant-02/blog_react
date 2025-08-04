import { Tag } from "../models/tag";
import { ResMsg } from "../templates/msg";
import { http } from "../utils/http";

export const fetchTagsAPI = () => {
  return http.request<ResMsg<Tag[]>>({
    url: "/tag/all",
    method: "GET",
  });
};

export const fetchTagsByArticleIdAPI = (id: string) => {
  return http.request<ResMsg<number[]>>({
    url: "/articleTag/ids/" + id,
    method: "GET",
  });
};
