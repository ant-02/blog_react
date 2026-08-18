import { useEffect, useState } from "react";
import { ArticleDTO } from "../../models/article";
import { useLocation } from "react-router-dom";
import Avatar from "../../assets/img/logo-white.png";
import ArticleCard from "../../components/ArticleCard";
import { UserDTO } from "../../models/user";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import Loading from "../../components/Loading";
import { Button } from "@/components/ui/button";
import {
  useGetArticleDTOsByUserIdQuery,
  useGetIsFollowQuery,
  useUpdateIsFollowMutation,
} from "../../services/api";

const Author: React.FC = () => {
  const pageSize = 3;
  const [page, setPage] = useState<number>(1);
  const [articleDTOs, setArticleDTOs] = useState<ArticleDTO[]>([]);
  const location = useLocation();
  const { author } = location.state as { author: UserDTO };
  const { user } = useSelector((state: RootState) => state.user);

  const { data: isFollow = false } = useGetIsFollowQuery(
    {
      followerId: String(user?.id ?? ""),
      followingId: String(author?.id ?? ""),
    },
    { skip: !user?.id || !author?.id }
  );

  const [updateIsFollow] = useUpdateIsFollowMutation();

  const { data: articlePage, isLoading } = useGetArticleDTOsByUserIdQuery(
    {
      userId: String(author?.id ?? ""),
      page: String(page),
      pageSize: String(pageSize),
      status: "published",
    },
    { skip: !author?.id }
  );

  useEffect(() => {
    if (articlePage?.articleDTOs) {
      setArticleDTOs((prev) =>
        page === 1 ? articlePage.articleDTOs : [...prev, ...articlePage.articleDTOs]
      );
    }
  }, [articlePage, page]);

  const followBtnClicked = async () => {
    if (!user?.id || !author?.id) return;
    try {
      await updateIsFollow({
        followerId: String(user.id),
        followingId: String(author.id),
        isFollow: isFollow ? "0" : "1",
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (!author) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center pt-[70px]">
      <div className="w-[1320px] max-w-full px-4">
        <div className="mx-5 flex items-center justify-between">
          <div className="flex flex-col items-center">
            <img
              src={author.avatar || Avatar}
              alt={author.username}
              className="h-[82px] w-[82px] rounded-full object-cover"
            />
            <span className="m-3 text-[32px] font-bold">{author.username}</span>
          </div>
          <Button variant={isFollow ? "outline" : "default"} onClick={followBtnClicked}>
            {isFollow ? "已关注" : "关注"}
          </Button>
        </div>
        <div className="mt-10 flex flex-wrap">
          {isLoading && articleDTOs.length === 0 ? (
            <Loading />
          ) : (
            articleDTOs.map((articleDTO) => (
              <div key={articleDTO.id} className="m-5">
                <ArticleCard article={articleDTO} />
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-center">
          {page * pageSize < (articlePage?.count ?? 0) && (
            <Button variant="secondary" onClick={() => setPage(page + 1)}>
              加载更多
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Author;
