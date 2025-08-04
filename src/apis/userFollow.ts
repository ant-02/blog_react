import { ResMsg } from "../templates/msg";
import { http } from "../utils/http";

export const fetchUserFollowerIdsAPI = (id: string) => {
  return http.request<ResMsg<number[]>>({
    url: "/userFollow/follower/" + id,
    method: "GET",
  });
};

export const fetchUserFollowingIdsAPI = (id: string) => {
  return http.request<ResMsg<number[]>>({
    url: "/userFollow/following/" + id,
    method: "GET",
  });
};

export const fetchIsFollowAPI = (followerId: string, followingId: string) => {
  return http.request<ResMsg<boolean>>({
    url: "/userFollow/auth/isFollow/" + followerId + "/" + followingId,
    method: "GET",
  });
};

export const updateIsFollowAPI = (
  followerId: string,
  followingId: string,
  isFollow: string
) => {
  return http.request<ResMsg<boolean>>({
    url:
      "/userFollow/auth/isFollow/" +
      followerId +
      "/" +
      followingId +
      "/" +
      isFollow,
    method: "PUT",
  });
};
