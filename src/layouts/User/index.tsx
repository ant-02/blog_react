import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../stores";
import Img from "../../assets/img/logo-white.png";
import { useEffect, useState } from "react";
import { ArticleDTO } from "../../models/article";
import ArticleCard from "../../components/ArticleCard";
import FollowCard from "../../components/FollowCard";
import Loading from "../../components/Loading";
import { logout } from "../../stores/modules/userSlice";
import { clearToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetArticleDTOsByUserIdQuery,
  useGetUserFollowerIdsQuery,
  useGetUserFollowingIdsQuery,
} from "../../services/api";

const User: React.FC = () => {
  const pageSize = 2;
  const { user, isLoading: isAuthLoading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [articleDTOs, setArticleDTOs] = useState<ArticleDTO[]>([]);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(true);

  const userId = user?.id ? String(user.id) : "";

  const { data: articlePage, isLoading: isArticlesLoading } = useGetArticleDTOsByUserIdQuery(
    {
      userId,
      page: String(page),
      pageSize: String(pageSize),
      status: "all",
    },
    { skip: !userId }
  );

  const { data: userFollowers = [], refetch: refetchFollowers } = useGetUserFollowerIdsQuery(
    userId,
    { skip: !userId }
  );
  const { data: userFollowings = [] } = useGetUserFollowingIdsQuery(userId, {
    skip: !userId,
  });

  useEffect(() => {
    if (!isAuthLoading && user === null) {
      navigate("/");
    }
  }, [isAuthLoading, user, navigate]);

  useEffect(() => {
    if (articlePage?.articleDTOs) {
      setArticleDTOs((prev) =>
        page === 1 ? articlePage.articleDTOs : [...prev, ...articlePage.articleDTOs]
      );
    }
  }, [articlePage, page]);

  if (isAuthLoading || user === null) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center">
      <div className="w-[1300px] max-w-full px-4 pt-[60px]">
        <div className="mt-5 flex items-center justify-between rounded-2xl p-5 shadow-md">
          <div className="flex items-center">
            <img
              src={user?.avatar || Img}
              alt={user?.username}
              className="h-[92px] w-[92px] rounded-full object-cover"
            />
            <span className="ml-5 text-[32px] font-bold">{user?.username}</span>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              clearToken();
              dispatch(logout());
              navigate("/");
            }}
          >
            退出登入
          </Button>
        </div>
        <div className="mt-10 flex justify-between">
          <div className="w-[20%] rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-center p-5">
              <div
                className="flex cursor-pointer flex-col items-center border-r border-border pr-10"
                onClick={() => {
                  setChecked(true);
                  setIsShow(true);
                }}
              >
                <div className="text-muted-foreground">关注了</div>
                <div>{userFollowers.length}</div>
              </div>
              <div
                className="flex cursor-pointer flex-col items-center pl-10"
                onClick={() => {
                  setChecked(false);
                  setIsShow(true);
                }}
              >
                <div className="text-muted-foreground">关注者</div>
                <div>{userFollowings.length}</div>
              </div>
            </div>
            <div className="pt-5">
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:bg-green-600/10 hover:text-green-600"
              >
                修改个人资料
              </Button>
            </div>
            <div className="pt-5">
              <div className="mt-5 text-base font-bold text-foreground">个人简介</div>
              <div className="mt-5 text-sm text-muted-foreground">
                {user?.bio ? user.bio : "请设置个人动态～"}
              </div>
              <div className="mt-5 text-sm text-muted-foreground">
                <div className="flex items-center pb-2">
                  <Phone className="h-4 w-4" />
                  <div className="pl-2">{user?.phone}</div>
                </div>
                <div className="flex items-center pb-2">
                  <Mail className="h-4 w-4" />
                  <div className="pl-2">{user?.email}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[70%] rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between p-5 text-base font-bold">
              <div>投稿</div>
              <span title="添加">
                <Plus
                  className="h-5 w-5 cursor-pointer hover:text-green-600"
                  onClick={() => navigate("/creation")}
                />
              </span>
            </div>
            <div className="flex flex-wrap justify-around">
              {isArticlesLoading && articleDTOs.length === 0 ? (
                <Loading />
              ) : (
                articleDTOs.map((articleDTO) => (
                  <div key={articleDTO.id} className="mx-4 my-5 flex items-end">
                    <ArticleCard article={articleDTO} />
                    <Pencil
                      className="h-5 w-5 cursor-pointer hover:text-green-600"
                      onClick={() =>
                        navigate("/creation", {
                          state: { id: articleDTO.id },
                        })
                      }
                    />
                  </div>
                ))
              )}
            </div>
            {page * pageSize < (articlePage?.count ?? 0) && (
              <div className="flex justify-center">
                <Button variant="secondary" onClick={() => setPage(page + 1)}>
                  加载更多
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isShow && (
        <FollowCard
          followerIds={userFollowers}
          followingIds={userFollowings}
          checked={checked}
          setChecked={(checked: boolean) => setChecked(checked)}
          close={() => setIsShow(false)}
          refreshFollower={refetchFollowers}
        />
      )}
    </div>
  );
};

export default User;
