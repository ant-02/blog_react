import CategoryNav from "../../components/CategoryNav";
import Loading from "../../components/Loading";
import { useGetCategoriesQuery } from "../../services/api";

const CategoryList: React.FC = () => {
  const { data: categoryList, isLoading } = useGetCategoriesQuery();

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col items-center pt-[70px]">
      <div className="w-[1320px] max-w-full px-4">
        {categoryList?.map((category) => (
          <CategoryNav key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
