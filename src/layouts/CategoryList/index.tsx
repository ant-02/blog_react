import classNames from "classnames";
import { useEffect, useState } from "react";
import { Category } from "../../models/category";
import { fetchCategoriesAPI } from "../../apis/category";
import CategoryNav from "../../components/CategoryNav";
import "./index.scss";

const CategoryList: React.FC = () => {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const res = await fetchCategoriesAPI();
        setCategoryList(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAllCategories();
  }, []);

  return (
    <div className={classNames("categoryList-out-container")}>
      <div className={classNames("categoryList-in-container")}>
        {categoryList.map((category, index) => (
          <CategoryNav key={index} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
