import classNames from "classnames";
import "./index.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import { Link } from "react-router-dom";
import LoginCard from "../../components/LoginCard";
import { useState } from "react";
import Img from "../../assets/img/logo-white.png";

const Login: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [isShow, setIsShow] = useState<boolean>(false);

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
          {isShow && <LoginCard close={() => setIsShow(false)} />}
        </div>
      )}
    </div>
  );
};

export default Login;
