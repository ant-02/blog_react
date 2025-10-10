import classNames from "classnames";
import "./index.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import { Link } from "react-router-dom";
import LoginCard from "../../components/LoginCard";
import { useState } from "react";
import Img from "../../assets/img/logo-white.png";
import RegisterCard from "../../components/RegisterCard";

const Login: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className={classNames("login")}>
      {user ? (
        <Link to="/user">
          <img
            src={user.avatar || Img}
            className={classNames("header-user-avatar")}
          ></img>
        </Link>
      ) : (
        <div>
          <button
            className={classNames("login-button")}
            onClick={() => setIsShow(true)}
          >
            登入
          </button>
          {isShow &&
            (isLogin ? (
              <LoginCard
                close={() => setIsShow(false)}
                toRegister={() => setIsLogin(false)}
              />
            ) : (
              <RegisterCard
                close={() => {
                  setIsShow(false);
                  setIsLogin(true);
                }}
                toLogin={() => setIsLogin(true)}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Login;
