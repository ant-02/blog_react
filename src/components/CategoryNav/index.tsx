import { Link } from "react-router-dom";
import { Category } from "../../models/category";
import ArticleCard from "../ArticleCard";
import Loading from "../Loading";
import { useGetArticleDTOsByCategoryIdQuery } from "../../services/api";

interface CategoryProps {
  category: Category;
}

const CategoryNav: React.FC<CategoryProps> = ({ category }) => {
  const { data: articleList, isLoading } = useGetArticleDTOsByCategoryIdQuery({
    id: category.id.toString(),
    count: "6",
  });

  return (
    <div className="mb-20 mt-5 w-full">
      <div className="m-5 text-[26px] font-bold">
        <Link to="/articleList" state={{ category }}>
          {category.name}
        </Link>
      </div>
      <div className="flex flex-wrap">
        {isLoading ? (
          <Loading />
        ) : (
          articleList?.map((article) => (
            <div key={article.id} className="m-5">
              <ArticleCard article={article} />
            </div>
          ))
        )}
      </div>
      <div className="my-10 w-full text-right">
        <Link
          className="m-5 inline-block rounded-full bg-secondary px-[22px] py-2.5 text-lg font-bold text-secondary-foreground transition-colors hover:bg-secondary/80"
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
