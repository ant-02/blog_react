import classNames from "classnames";
import "./index.scss";
import { useEffect, useState } from "react";
import { UserDTO } from "../../models/user";
import { fetchUserDTOByIdAPI } from "../../apis/user";
import Avatar from "../../assets/img/logo-white.png";
import { updateIsFollowAPI } from "../../apis/userFollow";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";

interface FollowCardProps {
  followerIds: number[];
  followingIds: number[];
  checked: boolean;
  setChecked: (checked: boolean) => void;
  close: () => void;
  refreshFollower: () => void;
}

const FollowCard: React.FC<FollowCardProps> = ({
  followerIds,
  followingIds,
  checked,
  setChecked,
  close,
  refreshFollower,
}) => {
  const [followers, setFollowers] = useState<UserDTO[]>([]);
  const [followerDels, setFollowerDels] = useState<boolean[]>([]);
  const [followings, setFollowings] = useState<UserDTO[]>([]);
  const [followingAdds, setFollowingAdds] = useState<boolean[]>([]);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const getFollows = async () => {
      try {
        for (const id of followerIds) {
          const res = await fetchUserDTOByIdAPI(String(id));
          setFollowers([...followers, res.data.data]);
          setFollowerDels([...followerDels, false]);
        }
        for (const id of followingIds) {
          const res = await fetchUserDTOByIdAPI(String(id));
          setFollowings([...followings, res.data.data]);
          setFollowingAdds([
            ...followingAdds,
            followers.some(
              (follower, index) =>
                !followerDels[index] && follower.id === res.data.data.id
            ),
          ]);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getFollows();
  }, []);

  const followerBtn = async (id: number, index: number) => {
    try {
      const res = await updateIsFollowAPI(
        String(user?.id),
        String(id),
        followerDels[index] ? "1" : "0"
      );
      if (!res.data.data) return;
      setFollowerDels(
        followerDels.map((item, i) => (i == index ? !item : item))
      );
      refreshFollower();
    } catch (e) {
      console.log(e);
    }
  };

  const followingBtn = async (id: number, index: number) => {
    try {
      const res = await updateIsFollowAPI(
        String(user?.id),
        String(id),
        followingAdds[index] ? "1" : "0"
      );
      if (!res.data.data) return;
      setFollowingAdds(
        followingAdds.map((item, i) => (i == index ? !item : item))
      );
      refreshFollower();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={classNames("followCard-out-container")}>
      <div className={classNames("followCard-in-container")}>
        <div className={classNames("followCard-container-title")}>
          <div>
            <span
              style={checked ? { color: "#262626bf" } : {}}
              onClick={() => setChecked(true)}
            >
              {"关注了 " + String(followerIds.length)}
            </span>
            <span
              style={checked ? {} : { color: "#262626bf" }}
              onClick={() => setChecked(false)}
            >
              {"关注者 " + String(followingIds.length)}
            </span>
          </div>
          <i
            className={classNames("iconfont icon-guanbi icon-close")}
            style={{ fontSize: "24px" }}
            onClick={close}
          ></i>
        </div>
        <div className={classNames("followCard-container")}>
          {checked
            ? followers.map((follower, index) => (
                <div key={index}>
                  <div>
                    <img src={follower.avatar || Avatar}></img>
                    <div>{follower.username}</div>
                  </div>
                  <div>
                    <button
                      style={
                        followerDels[index]
                          ? { backgroundColor: "#2db55d", color: "white" }
                          : {}
                      }
                      onClick={() => followerBtn(follower.id, index)}
                    >
                      {followerDels[index] ? "关注" : "已关注"}
                    </button>
                  </div>
                </div>
              ))
            : followings.map((following, index) => (
                <div key={index}>
                  <div>
                    <img src={following.avatar || Avatar}></img>
                    <div>{following.username}</div>
                  </div>
                  <div>
                    <button
                      style={
                        !followingAdds[index]
                          ? {}
                          : { backgroundColor: "#2db55d", color: "white" }
                      }
                      onClick={() => followingBtn(following.id, index)}
                    >
                      {!followingAdds[index] ? "已关注" : "关注"}
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default FollowCard;
