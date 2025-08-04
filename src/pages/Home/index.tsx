import { Outlet } from "react-router-dom";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserInfoAPI } from "../../apis/user";
import { login, setIsLoading } from "../../stores/modules/userSlice";
import { getToken } from "../../utils/auth";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = getToken();
        if (token === null) {
          dispatch(setIsLoading({ isLoading: false }));
          return;
        }
        const res = await fetchUserInfoAPI();
        if (res.data.msg === "jwt已过期" || res.data.msg === "无效的认证令牌") {
          dispatch(setIsLoading({ isLoading: false }));
          return;
        }
        dispatch(login({ user: res.data.data }));
        dispatch(setIsLoading({ isLoading: false }));
      } catch (e) {
        console.log(e);
      }
    };
    getUserInfo();
  }, [dispatch]);

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Home;
