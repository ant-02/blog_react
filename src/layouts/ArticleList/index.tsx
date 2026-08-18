import { useEffect, useState } from "react";
import { fetchArticleDTOsByCategoryIdAPI } from "../../apis/article";
import { ArticleDTO } from "../../models/article";
import { Link, useLocation } from "react-router-dom";
import ArticleCard from "../../components/ArticleCard";
import Loading from "../../components/Loading";

const ArticleList: React.FC = () => {
  const location = useLocation();
  const category = location.state?.category;
  const [articleDTOs, setArticleDTOs] = useState<ArticleDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!category?.id) return;

    const getAllArticleDTOsByCategoryId = async () => {
      setIsLoading(true);
      try {
        const res = await fetchArticleDTOsByCategoryIdAPI(String(category.id), "-1");
        setArticleDTOs(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    getAllArticleDTOsByCategoryId();
  }, [category?.id]);

  if (!category) {
    return (
      <div className="flex flex-col items-center pt-[70px]">
        <div className="w-[1320px] max-w-full px-4">
          <p>
            未选择专题，请
            <Link to="/category" className="text-primary hover:underline">
              选择专题
            </Link>
            。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-[70px]">
      <div className="w-[1320px] max-w-full px-4">
        <div className="mx-5 flex items-center pt-10">
          <Link to="/category" className="text-[32px] font-bold text-foreground">
            标签：
          </Link>
          <div className="ml-5 rounded-full border border-border px-[18px] py-1 text-[22px]">
            {category.name}
          </div>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="mt-[100px] flex flex-wrap">
            {articleDTOs.map((article) => (
              <div key={article.id} className="m-5">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleList;
