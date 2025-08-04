import { useEffect, useState } from "react";
import { fetchArticleDTOsByCategoryIdAPI } from "../../apis/article";
import { ArticleDTO } from "../../models/article";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import ArticleCard from "../../components/ArticleCard";
import "./index.scss";

const ArticleList: React.FC = () => {
  const location = useLocation();
  const category = location.state?.category;
  const [articleDTOs, setArticleDTOs] = useState<ArticleDTO[]>([]);
  useEffect(() => {
    const getAllArticleDTOsByCategoryId = async () => {
      try {
        const res = await fetchArticleDTOsByCategoryIdAPI(
          String(category.id),
          "-1"
        );
        setArticleDTOs(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    getAllArticleDTOsByCategoryId();
  }, [category.id]);
  return (
    <div className={classNames("articleList-out-container")}>
      <div className={classNames("articleList-in-container")}>
        <div className={classNames("articleList-title-box")}>
          <Link className={classNames("articleList-title-pre")} to="/category">
            标签：
          </Link>
          <div className={classNames("articleList-title")}>{category.name}</div>
        </div>
        <div className={classNames("articleList-container")}>
          {articleDTOs.map((article, index) => (
            <ArticleCard key={index} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
