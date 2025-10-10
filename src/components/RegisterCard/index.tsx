import classNames from "classnames";
import { useState } from "react";
import "./index.scss";
import { registerAPI } from "../../apis/user";
import { setToken } from "../../utils/auth";
import { login } from "../../stores/modules/userSlice";
import { useDispatch } from "react-redux";
import { message } from "antd";

interface ReginsterCardProps {
  close: () => void;
  toLogin: () => void;
}

const RegisterCard: React.FC<ReginsterCardProps> = ({ close, toLogin }) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [errorPhoneMessage, setErrorPhoneMessage] =
    useState("请输入有效的手机号码");
  const [errorPasswordMessage, setErrorPasswordMessage] =
    useState("密码不能为空");

  const registerBtnClicked = () => {
    if (!isPhoneValid) {
      messageApi.open({
        type: "error",
        content: errorPhoneMessage,
      });
    }
    if (!isPasswordValid) {
      messageApi.open({
        type: "error",
        content: errorPasswordMessage,
      });
    }
    if (!isPhoneValid || !isPasswordValid) return;
    const registerRequest = async () => {
      try {
        const res = await registerAPI(phone, password);
        if (res.status !== 200) {
          messageApi.open({
            type: "warning",
            content: "注册失败",
          });
          return;
        }
        setToken(JSON.stringify(res.data.data.token));
        dispatch(login({ user: res.data.data.user }));
      } catch (e) {
        console.log(e);
      }
    };
    registerRequest();
  };
  const validatePhoneNumber = (number: string) => {
    // 移除所有非数字字符
    const cleanNumber = number.replace(/\D/g, "");

    // 基础验证：11位数字
    if (cleanNumber.length !== 11) {
      return {
        isValid: false,
        message: "手机号码应为11位数字",
      };
    }

    // 验证号码段
    const mobilePattern =
      /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (!mobilePattern.test(cleanNumber)) {
      return {
        isValid: false,
        message: "请输入有效的手机号码",
      };
    }

    return {
      isValid: true,
      message: "",
    };
  };

  // 格式化手机号码
  const formatPhoneNumber = (number: string) => {
    const cleanNumber = number.replace(/\D/g, "");

    if (cleanNumber.length <= 3) {
      return cleanNumber;
    } else if (cleanNumber.length <= 7) {
      return `${cleanNumber.slice(0, 3)} ${cleanNumber.slice(3)}`;
    } else {
      return `${cleanNumber.slice(0, 3)} ${cleanNumber.slice(
        3,
        7
      )} ${cleanNumber.slice(7, 11)}`;
    }
  };

  const phoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanValue = inputValue.replace(/\D/g, "");

    // 限制最大长度为11位
    if (cleanValue.length <= 11) {
      const formattedValue = formatPhoneNumber(cleanValue);
      setPhone(formattedValue);

      // 当输入完整11位时进行验证
      if (cleanValue.length === 11) {
        const validation = validatePhoneNumber(cleanValue);
        setIsPhoneValid(validation.isValid);
        setErrorPhoneMessage(validation.message);
      } else {
        setIsPhoneValid(false);
        if (isPasswordValid) {
          setErrorPhoneMessage("请输入有效的手机号码");
        }
      }
    }
  };

  const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanValue = inputValue.replace(/\D/g, "");
    setPassword(cleanValue);
    if (cleanValue.length === 0) {
      setIsPasswordValid(false);
      setErrorPasswordMessage("密码不能为空");
    } else {
      setIsPasswordValid(true);
      setErrorPasswordMessage("");
    }
  };
  return (
    <div className={classNames("login-card")}>
      {contextHolder}
      <div className={classNames("login-card-container")}>
        <div className={classNames("login-close")}>
          <i
            className={classNames("iconfont icon-guanbi icon-close")}
            style={{ fontSize: "24px" }}
            onClick={close}
          ></i>
        </div>
        <div>
          <div>账号注册</div>
        </div>
        <div className={classNames("login-input")}>
          <div>
            <span>账号</span>
            <input
              placeholder="手机号码"
              value={phone}
              onChange={phoneChange}
            ></input>
          </div>
          <div>
            <span>密码</span>
            <input
              type={isShow ? "text" : "password"}
              value={password}
              onChange={passwordChange}
            ></input>
            <i
              className={classNames(
                isShow ? "iconfont icon-yincang" : "iconfont icon-xianshi",
                "password-icon"
              )}
              style={{ fontSize: "24px", marginRight: 10 }}
              onClick={() => setIsShow(!isShow)}
            ></i>
          </div>
        </div>
        <div className={classNames("button-box")}>
          <button onClick={toLogin}>返回</button>
          <button onClick={registerBtnClicked}>注册</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterCard;
