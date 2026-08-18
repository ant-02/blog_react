import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import Home from "../pages/Home";
import FullPageError from "../components/FullPageError";

const Article = lazy(() => import("../layouts/Article"));
const CategoryList = lazy(() => import("../layouts/CategoryList"));
const ArticleList = lazy(() => import("../layouts/ArticleList"));
const Category = lazy(() => import("../layouts/Category"));
const User = lazy(() => import("../layouts/User"));
const Author = lazy(() => import("../layouts/Author"));
const Creation = lazy(() => import("../layouts/Creation"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <FullPageError />,
    children: [
      {
        index: true,
        element: <CategoryList />,
        errorElement: <FullPageError />,
      },
      {
        path: "article/:id",
        element: <Article />,
        errorElement: <FullPageError />,
      },
      {
        path: "articleList",
        element: <ArticleList />,
        errorElement: <FullPageError />,
      },
      {
        path: "category",
        element: <Category />,
        errorElement: <FullPageError />,
      },
      {
        path: "user",
        element: <User />,
        errorElement: <FullPageError />,
      },
      {
        path: "author",
        element: <Author />,
        errorElement: <FullPageError />,
      },
      {
        path: "creation",
        element: <Creation />,
        errorElement: <FullPageError />,
      },
    ],
  },
]);
