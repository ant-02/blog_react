import { useSelector } from "react-redux";
import "./index.scss";
import { RootState } from "../../stores";
import Img from "../../assets/img/logo-white.png";
import { useEffect, useState } from "react";
import { ArticleDTO } from "../../models/article";
import ArticleCard from "../../components/ArticleCard";
import { fetchArticleDTOsByUserIdAPI } from "../../apis/article";
import classNames from "classnames";
import {
  fetchUserFollowerIdsAPI,
  fetchUserFollowingIdsAPI,
} from "../../apis/userFollow";
import { logout } from "../../stores/modules/userSlice";
import { clearToken } from "../../utils/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import FollowCard from "../../components/FollowCard";

const User: React.FC = () => {
  const pageSize = 2;
  const { user, isLoading } = useSelector((state: RootState) => state.user);
  const [articleDTOs, setArticleDTOs] = useState<ArticleDTO[]>([]);
  const [userFollowers, setUserFollowers] = useState<number[]>([]);
  const [userFollowings, setUserFollowings] = useState<number[]>([]);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoading && user === null) {
      Swal.fire("请登入！");
      navigate("/");
    }
  }, [isLoading]);

  useEffect(() => {
    const getArticleDTOsByUserId = async () => {
      if (!user?.id) return;
      const res1 = await fetchArticleDTOsByUserIdAPI(
        String(user.id),
        String(page),
        String(pageSize),
        "all"
      );
      const res2 = await fetchUserFollowerIdsAPI(String(user.id));
      const res3 = await fetchUserFollowingIdsAPI(String(user.id));
      if (res1.data.data.articleDTOs != null)
        setArticleDTOs([...articleDTOs, ...res1.data.data.articleDTOs]);
      setCount(res1.data.data.count);
      setUserFollowers(res2.data.data || []);
      setUserFollowings(res3.data.data || []);
    };
    getArticleDTOsByUserId();
  }, [page, user]);

  const refreshFollowers = async () => {
    try {
      const res2 = await fetchUserFollowerIdsAPI(String(user?.id));
      const res3 = await fetchUserFollowingIdsAPI(String(user?.id));
      setUserFollowers(res2.data.data || []);
      setUserFollowings(res3.data.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={classNames("user-out")}>
      <div className={classNames("user-in")}>
        <div className={classNames("user-header")}>
          <div>
            <img src={user?.avatar || Img}></img>
            <span>{user?.username}</span>
          </div>
          <div>
            <button
              onClick={() => {
                clearToken();
                logout();
                window.location.reload();
              }}
            >
              退出登入
            </button>
          </div>
        </div>
        <div className={classNames("user-container")}>
          <div className={classNames("user-container-left")}>
            <div className={classNames("user-container-follow")}>
              <div
                onClick={() => {
                  setChecked(true);
                  setIsShow(true);
                }}
              >
                <div>关注了</div>
                <div>{userFollowers.length}</div>
              </div>
              <div
                onClick={() => {
                  setChecked(false);
                  setIsShow(true);
                }}
              >
                <div>关注者</div>
                <div>{userFollowings.length}</div>
              </div>
            </div>
            <div className={classNames("user-container-alter")}>
              <button>修改个人资料</button>
            </div>
            <div className={classNames("user-container-info")}>
              <div>个人简介</div>
              <div>{user?.bio ? user.bio : "请设置个人动态～"}</div>
              <div>
                <div>
                  <i className={classNames("iconfont icon-dianhua")}></i>
                  <div>{user?.phone}</div>
                </div>
                <div>
                  <i className={classNames("iconfont icon-youxiang")}></i>
                  <div>{user?.email}</div>
                </div>
              </div>
            </div>
          </div>
          <div className={classNames("user-container-right")}>
            <div>
              <div>投稿</div>
              <i
                className={classNames(
                  "iconfont icon-tianjia",
                  "user-container-right-add"
                )}
                title="添加"
                onClick={() => navigate("/creation")}
              ></i>
            </div>
            <div className={classNames("user-container-right-content")}>
              {articleDTOs.map((articleDTO, index) => (
                <div key={index}>
                  <ArticleCard article={articleDTO} />
                  <i
                    className="iconfont icon-xiugai"
                    onClick={() =>
                      navigate("/creation", {
                        state: { id: articleDTO.id },
                      })
                    }
                  ></i>
                </div>
              ))}
            </div>
            {page * pageSize < count && (
              <div className={classNames("user-container-right-content-more")}>
                <button onClick={() => setPage(page + 1)}>加载更多</button>
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
          refreshFollower={refreshFollowers}
        />
      )}
    </div>
  );
};

export default User;
