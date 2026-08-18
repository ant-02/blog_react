export const setToken = (token: string) => {
  localStorage.setItem("xHHx_token", token);
};

export const getToken = () => {
  return localStorage.getItem("xHHx_token");
};

export const clearToken = () => {
  localStorage.removeItem("xHHx_token");
};
