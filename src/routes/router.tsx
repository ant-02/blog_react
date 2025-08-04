import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Article from "../layouts/Article";
import CategoryList from "../layouts/CategoryList";
import ArticleList from "../layouts/ArticleList";
import Category from "../layouts/Category";
import User from "../layouts/User";
import Author from "../layouts/Author";
import Creation from "../layouts/Creation";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <CategoryList />,
      },
      {
        path: "article/:id",
        element: <Article />,
      },
      {
        path: "articleList",
        element: <ArticleList />,
      },
      {
        path: "category",
        element: <Category />,
      },
      {
        path: "user",
        element: <User />,
      },
      {
        path: "author",
        element: <Author />
      },
      {
        path: "creation",
        element: <Creation />
      }
    ],
  },
]);
