import classNames from "classnames";
import { useState } from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import { loginAPI } from "../../apis/user";
import { setToken } from "../../utils/auth";
import { login } from "../../stores/modules/userSlice";
import { useDispatch } from "react-redux";

interface LoginCardProps {
  close: () => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ close }) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();

  const loginBtnClicked = () => {
    const loginRequest = async () => {
      try {
        const res = await loginAPI(phone, password);
        setToken(JSON.stringify(res.data.data.token));
        dispatch(login({ user: res.data.data.user }));
      } catch (e) {
        console.log(e);
      }
    };
    loginRequest();
  };
  return (
    <div className={classNames("login-card")}>
      <div className={classNames("login-card-container")}>
        <div className={classNames("login-close")}>
          <i
            className={classNames("iconfont icon-guanbi icon-close")}
            style={{ fontSize: "24px" }}
            onClick={close}
          ></i>
        </div>
        <div>
          <div>账号登入</div>
        </div>
        <div className={classNames("login-input")}>
          <div>
            <span>账号</span>
            <input
              placeholder="手机号码"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPhone(e.target.value)
              }
            ></input>
          </div>
          <div>
            <span>密码</span>
            <input
              type={isShow ? "text" : "password"}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            ></input>
            <i
              className={classNames(
                isShow ? "iconfont icon-yincang" : "iconfont icon-xianshi",
                "password-icon"
              )}
              style={{ fontSize: "24px" }}
              onClick={() => setIsShow(!isShow)}
            ></i>
            <Link to="/" className={classNames("forget")}>
              忘记密码?
            </Link>
          </div>
        </div>
        <div className={classNames("button-box")}>
          <button>注册</button>
          <button onClick={loginBtnClicked}>登入</button>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
