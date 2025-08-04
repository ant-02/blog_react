import { Link } from "react-router-dom";
import { Category } from "../../models/category";
import "./index.scss";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { fetchArticleDTOsByCategoryIdAPI } from "../../apis/article";
import { ArticleDTO } from "../../models/article";
import ArticleCard from "../ArticleCard";

interface CategoryProps {
  category: Category;
}

const CategoryNav: React.FC<CategoryProps> = ({ category }) => {
  const [articleList, setArticleList] = useState<ArticleDTO[]>([]);
  useEffect(() => {
    const getArticleDTOByCategoryId = async () => {
      try {
        const res = await fetchArticleDTOsByCategoryIdAPI(
          category.id.toString(),
          "6"
        );
        setArticleList(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    getArticleDTOByCategoryId();
  }, [category]);
  return (
    <div className={classNames("categoryNav")}>
      <div className={classNames("categoryNav-header")}>
        <Link to="/articleList" state={{ category }}>
          {category.name}
        </Link>
      </div>
      <div className={classNames("categoryNav-container")}>
        {articleList && articleList.map((article, index) => (
            <ArticleCard key={index} article={article} />
        ))}
      </div>
      <div className={classNames("categoryNav-more-row")}>
        <Link
          className={classNames("categoryNav-more-but")}
          to="/articleList"
          state={{ category }}
        >
          更多
        </Link>
      </div>
    </div>
  );
};

export default CategoryNav;
