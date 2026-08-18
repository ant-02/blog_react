import { Outlet } from "react-router-dom";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, setIsLoading } from "../../stores/modules/userSlice";
import { useGetUserInfoQuery } from "../../services/api";
import { getToken } from "../../utils/auth";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const token = getToken();
  const {
    data: user,
    isLoading,
    isError,
  } = useGetUserInfoQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      dispatch(login({ user }));
    }
    dispatch(setIsLoading({ isLoading: false }));
  }, [dispatch, user, isLoading]);

  useEffect(() => {
    if (isError) {
      dispatch(setIsLoading({ isLoading: false }));
    }
  }, [dispatch, isError]);

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Home;
