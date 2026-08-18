import { useEffect, useState } from "react";
import { UserDTO } from "../../models/user";
import { fetchUserDTOByIdAPI } from "../../apis/user";
import Avatar from "../../assets/img/logo-white.png";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import Loading from "../Loading";
import { Button } from "@/components/ui/button";
import { useUpdateIsFollowMutation } from "../../services/api";
import { createPortal } from "react-dom";

interface FollowCardProps {
  followerIds: number[];
  followingIds: number[];
  checked: boolean;
  setChecked: (checked: boolean) => void;
  close: () => void;
  refreshFollower: () => void;
}

interface FollowUser extends UserDTO {
  isToggled: boolean;
}

const FollowUserItem: React.FC<{
  user: FollowUser;
  onToggle: () => void;
  isFollowing: boolean;
}> = ({ user, onToggle, isFollowing }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center">
        <img
          src={user.avatar || Avatar}
          alt={user.username}
          className="h-[82px] w-[82px] rounded-full object-cover"
        />
        <div className="ml-2.5">{user.username}</div>
      </div>
      <div>
        <Button variant={user.isToggled ? "default" : "outline"} size="sm" onClick={onToggle}>
          {isFollowing ? (user.isToggled ? "关注" : "已关注") : user.isToggled ? "已关注" : "关注"}
        </Button>
      </div>
    </div>
  );
};

const FollowCard: React.FC<FollowCardProps> = ({
  followerIds,
  followingIds,
  checked,
  setChecked,
  close,
  refreshFollower,
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  const [updateIsFollow] = useUpdateIsFollowMutation();

  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [followings, setFollowings] = useState<FollowUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const followerResults = await Promise.all(
          followerIds.map((id) => fetchUserDTOByIdAPI(String(id)))
        );
        const followingResults = await Promise.all(
          followingIds.map((id) => fetchUserDTOByIdAPI(String(id)))
        );

        if (cancelled) return;

        const followerUsers = followerResults.map((res) => ({
          ...res.data.data,
          isToggled: false,
        }));
        const followingUsers = followingResults.map((res) => ({
          ...res.data.data,
          isToggled: followerUsers.some((f) => f.id === res.data.data.id),
        }));

        setFollowers(followerUsers);
        setFollowings(followingUsers);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [followerIds, followingIds]);

  const handleToggle = async (
    targetUser: FollowUser,
    index: number,
    isFollowingSection: boolean
  ) => {
    if (!user?.id) return;

    try {
      await updateIsFollow({
        followerId: String(user.id),
        followingId: String(targetUser.id),
        isFollow: targetUser.isToggled ? "0" : "1",
      }).unwrap();

      if (isFollowingSection) {
        setFollowings((prev) =>
          prev.map((item, i) => (i === index ? { ...item, isToggled: !item.isToggled } : item))
        );
      } else {
        setFollowers((prev) =>
          prev.map((item, i) => (i === index ? { ...item, isToggled: !item.isToggled } : item))
        );
      }
      refreshFollower();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="flex h-[60vh] w-[40vw] min-w-[320px] flex-col items-center overflow-y-auto overflow-x-hidden rounded-tl-3xl bg-card p-2.5 px-5 text-card-foreground">
        <div className="flex w-full items-center justify-between pt-2.5">
          <div>
            <span
              className={`m-[5px] inline-block cursor-pointer border-r border-border px-2.5 py-0 text-sm ${
                checked ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setChecked(true)}
            >
              {"关注了 " + String(followerIds.length)}
            </span>
            <span
              className={`m-[5px] inline-block cursor-pointer px-2.5 py-0 text-sm ${
                checked ? "text-muted-foreground" : "text-foreground"
              }`}
              onClick={() => setChecked(false)}
            >
              {"关注者 " + String(followingIds.length)}
            </span>
          </div>
          <i className="iconfont icon-guanbi cursor-pointer text-[32px]" onClick={close}></i>
        </div>
        <div className="h-full w-full">
          {checked
            ? followers.map((follower, index) => (
                <FollowUserItem
                  key={follower.id}
                  user={follower}
                  isFollowing={false}
                  onToggle={() => handleToggle(follower, index, false)}
                />
              ))
            : followings.map((following, index) => (
                <FollowUserItem
                  key={following.id}
                  user={following}
                  isFollowing={true}
                  onToggle={() => handleToggle(following, index, true)}
                />
              ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FollowCard;
