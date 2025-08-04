import classNames from "classnames";
import "./index.scss";
import { useEffect, useState } from "react";
import { UserDTO } from "../../models/user";
import { ArticleDTO } from "../../models/article";
import { fetchUserDTOsByKeywords } from "../../apis/user";
import { fetchArticleDTOsByKeywordsAPI } from "../../apis/article";
import { Link } from "react-router-dom";
import { getDateByFormat } from "../../utils/time";
import Img from "../../assets/img/logo-white.png";

interface SearchCardProps {
  val: string;
}

const SearchCard: React.FC<SearchCardProps> = ({ val }) => {
  const [userDTOs, setUserDTOs] = useState<UserDTO[]>([]);
  const [articleDTOs, setArticleDTOs] = useState<ArticleDTO[]>([]);
  const [search, setSearch] = useState<boolean>(false);

  useEffect(() => {
    const getSearchInfo = async () => {
      setSearch(false);
      const res1 = await fetchUserDTOsByKeywords(val);
      const res2 = await fetchArticleDTOsByKeywordsAPI(val);
      setUserDTOs(res1.data.data ? res1.data.data : []);
      setArticleDTOs(res2.data.data ? res2.data.data : []);
      setSearch(true);
    };
    getSearchInfo();
  }, [val]);
  return (
    <div className={classNames("searchCard")}>
      <div className={classNames("searchCard-title")}>
        {search
          ? "关于 " +
            val +
            " 搜索到" +
            userDTOs.length +
            "条相关用户和" +
            articleDTOs.length +
            "条相关文章"
          : "正在搜索 " + val + "..."}
      </div>
      <div className={classNames("searchCard-user")}>
        {userDTOs.length > 0 ? (
          userDTOs.map((userDTO, index) => (
            <Link to="" key={index}>
              <img src={userDTO.avatar || Img}></img>
              <span>{userDTO.username}</span>
            </Link>
          ))
        ) : (
          <span>未查询到相关用户</span>
        )}
      </div>
      <div className={classNames("searchCard-article")}>
        {articleDTOs.length > 0 ? (
          articleDTOs.map((articleDTO, index) => (
            <Link to={"/article/" + articleDTO.id} key={index}>
              <img src={articleDTO.coverImage || Img}></img>
              <div className={classNames("searchCard-article-container")}>
                <div>{articleDTO.title}</div>
                <div>{getDateByFormat(articleDTO.updatedAt, "yyyy/MM/dd")}</div>
                <div>{articleDTO.summary}</div>
              </div>
            </Link>
          ))
        ) : (
          <span>未查询到相关文章</span>
        )}
      </div>
    </div>
  );
};

export default SearchCard;
