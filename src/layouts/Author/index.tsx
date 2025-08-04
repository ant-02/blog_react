import { useEffect, useState } from "react";
import { ArticleDTO } from "../../models/article";
import { fetchArticleDTOsByUserIdAPI } from "../../apis/article";
import classNames from "classnames";
import "./index.scss";
import { useLocation } from "react-router-dom";
import Avatar from "../../assets/img/logo-white.png";
import ArticleCard from "../../components/ArticleCard";
import { UserDTO } from "../../models/user";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import { fetchIsFollowAPI, updateIsFollowAPI } from "../../apis/userFollow";

const Author: React.FC = () => {
  const pageSize = 3;
  const [page, setPage] = useState<number>(1);
  const [articleDTOs, setArticleDTOs] = useState<ArticleDTO[]>([]);
  const [count, setCount] = useState<number>(0);
  const location = useLocation();
  const { author } = location.state as { author: UserDTO };
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user) return;
    const getIsFollow = async () => {
      const res = await fetchIsFollowAPI(String(user.id), String(author.id));
      setIsFollow(res.data.data);
    };
    getIsFollow();
  }, [user]);

  useEffect(() => {
    const getArticleDTOsByAuthorId = async () => {
      const res = await fetchArticleDTOsByUserIdAPI(
        String(author.id),
        String(page),
        String(pageSize),
        "published"
      );
      if (res.data.data.articleDTOs !== null)
        setArticleDTOs([...articleDTOs, ...res.data.data.articleDTOs]);
      setCount(res.data.data.count || 0);
    };
    getArticleDTOsByAuthorId();
  }, [page]);

  const followBtnClicked = async () => {
    try {
      const res = await updateIsFollowAPI(
        String(user?.id),
        String(author.id),
        isFollow ? "0" : "1"
      );
      if (res.data.data) setIsFollow(!isFollow);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={classNames("author-out-container")}>
      <div className={classNames("author-in-container")}>
        <div className={classNames("author-header")}>
          <div>
            <img src={author.avatar || Avatar}></img>
            <span>{author.username}</span>
          </div>
          <div>
            <button
              style={
                isFollow
                  ? {
                      color: "rgba(90, 90, 90)",
                      backgroundColor: "rgba(134, 130, 169, 0.1451)",
                    }
                  : {}
              }
              onClick={followBtnClicked}
            >
              {isFollow ? "已关注" : "关注"}
            </button>
          </div>
        </div>
        <div className={classNames("author-container")}>
          {articleDTOs.map((articleDTO, index) => (
            <ArticleCard key={index} article={articleDTO} />
          ))}
        </div>
        <div className={classNames("author-footer")}>
          {page * pageSize < count && (
            <button onClick={() => setPage(page + 1)}>加载更多</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Author;
