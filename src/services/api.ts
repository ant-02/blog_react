import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";
import { ResMsg } from "../templates/msg";
import { User, UserDTO, LoginResponse } from "../models/user";
import {
  Article,
  ArticleCreatePayload,
  ArticleDTO,
  ArticleDTOs,
  ArticleUpdatePayload,
} from "../models/article";
import { Category } from "../models/category";
import { Tag } from "../models/tag";
import { ArticleCategory } from "../models/articleCategory";

export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "CurrentUser",
    "UserDTO",
    "Article",
    "ArticleDTO",
    "Category",
    "Tag",
    "Follow",
    "ArticleCategory",
  ],
  endpoints: (builder) => ({
    // User
    getUserInfo: builder.query<User, void>({
      query: () => ({ url: "/user/auth/info", method: "GET" }),
      transformResponse: (response: ResMsg<User>) => response.data,
      providesTags: ["CurrentUser"],
    }),
    getUserDTOById: builder.query<UserDTO, string>({
      query: (id) => ({ url: `/user/dto/${id}`, method: "GET" }),
      transformResponse: (response: ResMsg<UserDTO>) => response.data,
      providesTags: (result) => (result ? [{ type: "UserDTO", id: result.id }] : ["UserDTO"]),
    }),
    getUserDTOsByKeywords: builder.query<UserDTO[], string>({
      query: (keywords) => ({ url: `/user/dtos/${keywords}`, method: "GET" }),
      transformResponse: (response: ResMsg<UserDTO[]>) => response.data,
      providesTags: ["UserDTO"],
    }),
    login: builder.mutation<LoginResponse, { phone: string; password: string }>({
      query: (body) => ({ url: "/user/login", method: "POST", data: body }),
      transformResponse: (response: ResMsg<LoginResponse>) => response.data,
      invalidatesTags: ["CurrentUser"],
    }),
    register: builder.mutation<LoginResponse, { phone: string; password: string }>({
      query: (body) => ({ url: "/user/register", method: "POST", data: body }),
      transformResponse: (response: ResMsg<LoginResponse>) => response.data,
      invalidatesTags: ["CurrentUser"],
    }),

    // Article
    getArticleById: builder.query<Article, string>({
      query: (id) => ({ url: `/article/${id}`, method: "GET" }),
      transformResponse: (response: ResMsg<Article>) => response.data,
      providesTags: (result) => (result ? [{ type: "Article", id: result.id }] : ["Article"]),
    }),
    getArticleDTOsByCategoryId: builder.query<ArticleDTO[], { id: string; count: string }>({
      query: ({ id, count }) => ({
        url: `/article/dtos/categoryId/${id}/${count}`,
        method: "GET",
      }),
      transformResponse: (response: ResMsg<ArticleDTO[]>) => response.data,
      providesTags: ["ArticleDTO"],
    }),
    getArticleDTOsByKeywords: builder.query<ArticleDTO[], string>({
      query: (keywords) => ({
        url: `/article/dtos/keywords/${keywords}`,
        method: "GET",
      }),
      transformResponse: (response: ResMsg<ArticleDTO[]>) => response.data,
      providesTags: ["ArticleDTO"],
    }),
    getArticleDTOsByUserId: builder.query<
      ArticleDTOs,
      { userId: string; page: string; pageSize: string; status: string }
    >({
      query: ({ userId, page, pageSize, status }) => ({
        url: `/article/dtos/userId/${userId}/${page}/${pageSize}/${status}`,
        method: "GET",
      }),
      transformResponse: (response: ResMsg<ArticleDTOs>) => response.data,
      providesTags: ["ArticleDTO"],
    }),
    createArticle: builder.mutation<boolean, ArticleCreatePayload>({
      query: (article) => ({ url: "/article/auth", method: "POST", data: article }),
      transformResponse: (response: ResMsg<boolean>) => response.data,
      invalidatesTags: ["ArticleDTO"],
    }),
    updateArticle: builder.mutation<boolean, ArticleUpdatePayload>({
      query: (article) => ({ url: "/article/auth", method: "PUT", data: article }),
      transformResponse: (response: ResMsg<boolean>) => response.data,
      invalidatesTags: (_result, _error, arg) => ["ArticleDTO", { type: "Article", id: arg.id }],
    }),

    // Category
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: "/category/all", method: "GET" }),
      transformResponse: (response: ResMsg<Category[]>) => response.data,
      providesTags: ["Category"],
    }),
    getCategoryByArticleId: builder.query<number, string>({
      query: (id) => ({
        url: `/articleCategory/categoryId/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ResMsg<number>) => response.data,
      providesTags: ["ArticleCategory"],
    }),

    // Tag
    getTags: builder.query<Tag[], void>({
      query: () => ({ url: "/tag/all", method: "GET" }),
      transformResponse: (response: ResMsg<Tag[]>) => response.data,
      providesTags: ["Tag"],
    }),
    getTagsByArticleId: builder.query<number[], string>({
      query: (id) => ({ url: `/articleTag/ids/${id}`, method: "GET" }),
      transformResponse: (response: ResMsg<number[]>) => response.data,
      providesTags: ["Tag"],
    }),

    // Follow
    getUserFollowerIds: builder.query<number[], string>({
      query: (id) => ({ url: `/userFollow/follower/${id}`, method: "GET" }),
      transformResponse: (response: ResMsg<number[]>) => response.data,
      providesTags: ["Follow"],
    }),
    getUserFollowingIds: builder.query<number[], string>({
      query: (id) => ({ url: `/userFollow/following/${id}`, method: "GET" }),
      transformResponse: (response: ResMsg<number[]>) => response.data,
      providesTags: ["Follow"],
    }),
    getIsFollow: builder.query<boolean, { followerId: string; followingId: string }>({
      query: ({ followerId, followingId }) => ({
        url: `/userFollow/auth/isFollow/${followerId}/${followingId}`,
        method: "GET",
      }),
      transformResponse: (response: ResMsg<boolean>) => response.data,
      providesTags: ["Follow"],
    }),
    updateIsFollow: builder.mutation<
      boolean,
      { followerId: string; followingId: string; isFollow: string }
    >({
      query: ({ followerId, followingId, isFollow }) => ({
        url: `/userFollow/auth/isFollow/${followerId}/${followingId}/${isFollow}`,
        method: "PUT",
      }),
      transformResponse: (response: ResMsg<boolean>) => response.data,
      invalidatesTags: ["Follow"],
    }),

    // ArticleCategory
    updateArticleCategory: builder.mutation<boolean, ArticleCategory>({
      query: (articleCategory) => ({
        url: "/articleCategory/auth",
        method: "PUT",
        data: articleCategory,
      }),
      transformResponse: (response: ResMsg<boolean>) => response.data,
      invalidatesTags: ["ArticleCategory"],
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useGetUserDTOByIdQuery,
  useGetUserDTOsByKeywordsQuery,
  useLoginMutation,
  useRegisterMutation,
  useGetArticleByIdQuery,
  useGetArticleDTOsByCategoryIdQuery,
  useGetArticleDTOsByKeywordsQuery,
  useGetArticleDTOsByUserIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useGetCategoriesQuery,
  useGetCategoryByArticleIdQuery,
  useGetTagsQuery,
  useGetTagsByArticleIdQuery,
  useGetUserFollowerIdsQuery,
  useGetUserFollowingIdsQuery,
  useGetIsFollowQuery,
  useUpdateIsFollowMutation,
  useUpdateArticleCategoryMutation,
} = api;
