import { useEffect, useState } from "react";
import { Category as Cg } from "../../models/category";
import { fetchCategoriesAPI } from "../../apis/category";
import classNames from "classnames";
import "./index.scss";
import { Link } from "react-router-dom";

const Category: React.FC = () => {
  const [categories, setCategories] = useState<Cg[]>([]);
  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const res = await fetchCategoriesAPI();
        setCategories(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    getAllCategories();
  }, []);

  return (
    <div className={classNames("category-out-container")}>
      <div className={classNames("category-in-container")}>
        <div className={classNames("category-title")}>全部专题</div>
        <div className={classNames("category-container")}>
          {categories.map((category, index) => (
            <Link
              key={index}
              to="/articleList"
              state={{ category }}
              className={classNames("category-container-content")}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
