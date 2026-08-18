import { Link } from "react-router-dom";
import Img from "../../assets/img/logo-white.png";
import { getDateByFormat } from "../../utils/time";
import Loading from "../../components/Loading";
import {
  useGetUserDTOsByKeywordsQuery,
  useGetArticleDTOsByKeywordsQuery,
} from "../../services/api";

interface SearchCardProps {
  val: string;
}

const SearchCard: React.FC<SearchCardProps> = ({ val }) => {
  const { data: userDTOs = [], isLoading: isUsersLoading } = useGetUserDTOsByKeywordsQuery(val);
  const { data: articleDTOs = [], isLoading: isArticlesLoading } =
    useGetArticleDTOsByKeywordsQuery(val);

  const isLoading = isUsersLoading || isArticlesLoading;

  return (
    <div className="absolute right-1.5 top-[50px] z-50 mt-1 box-border w-[500px] max-w-[90vw] max-h-[80vh] overflow-y-auto overflow-x-hidden rounded-lg bg-popover p-[18px] text-popover-foreground shadow-xl">
      <div className="w-full border-b border-border pb-4 text-xs">
        {isLoading
          ? `正在搜索 ${val}...`
          : `关于 ${val} 搜索到${userDTOs.length}条相关用户和${articleDTOs.length}条相关文章`}
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="flex border-b border-border py-5">
            {userDTOs.length > 0 ? (
              userDTOs.map((userDTO) => (
                <Link to="" key={userDTO.id} className="flex flex-col items-center px-2.5 text-sm">
                  <img
                    src={userDTO.avatar || Img}
                    alt={userDTO.username}
                    className="h-8 w-8 rounded-full object-cover pb-1"
                  />
                  <span>{userDTO.username}</span>
                </Link>
              ))
            ) : (
              <span>未查询到相关用户</span>
            )}
          </div>
          <div className="flex flex-col border-b border-border py-5">
            {articleDTOs.length > 0 ? (
              articleDTOs.map((articleDTO) => (
                <Link
                  to={`/article/${articleDTO.id}`}
                  key={articleDTO.id}
                  className="flex h-[62px] items-center"
                >
                  <img
                    src={articleDTO.coverImage || Img}
                    alt={articleDTO.title}
                    className="h-[62px] w-24 rounded-[31px] object-cover"
                  />
                  <div className="ml-2.5 flex w-[80%] flex-col">
                    <div className="text-base font-bold">{articleDTO.title}</div>
                    <div className="py-2.5 text-[10px] text-muted-foreground">
                      {getDateByFormat(articleDTO.updatedAt, "yyyy/MM/dd")}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {articleDTO.summary}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <span>未查询到相关文章</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchCard;
