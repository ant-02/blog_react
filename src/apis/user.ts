import { LoginResponse, User, UserDTO } from "../models/user";
import { ResMsg } from "../templates/msg";
import { http } from "../utils/http";

export const fetchUserDTOByIdAPI = (id: string) => {
  return http.request<ResMsg<UserDTO>>({
    url: "/user/dto/" + id,
    method: "GET",
  });
};

export const fetchUserDTOsByKeywords = (keywords: string) => {
  return http.request<ResMsg<UserDTO[]>>({
    url: "/user/dtos/" + keywords,
    method: "GET",
  });
};

export const loginAPI = (phone: string, password: string) => {
  return http.request<ResMsg<LoginResponse>>({
    url: "/user/login",
    method: "POST",
    data: {
      phone: phone,
      password: password,
    },
  });
};

export const fetchUserInfoAPI = () => {
  return http.request<ResMsg<User>>({
    url: "/user/auth/info",
    method: "GET",
  });
};

export const registerAPI = (phone: string, password: string) => {
  return http.request<ResMsg<LoginResponse>>({
    url: "/user/register",
    method: "POST",
    data: {
      phone: phone,
      password: password,
    },
  });
};
