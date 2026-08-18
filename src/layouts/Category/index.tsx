import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { useGetCategoriesQuery } from "../../services/api";

const Category: React.FC = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery();

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col items-center pt-[70px]">
      <div className="w-[1320px] max-w-full px-4">
        <div className="mx-4 my-10 px-0 py-5 text-4xl font-bold">全部专题</div>
        <div className="flex flex-wrap items-center">
          {categories?.map((category) => (
            <Link
              key={category.id}
              to="/articleList"
              state={{ category }}
              className="mx-4 my-2 flex h-9 items-center justify-center rounded-full border border-border bg-card px-[18px] text-center text-base text-card-foreground transition-colors hover:bg-foreground hover:text-background"
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
