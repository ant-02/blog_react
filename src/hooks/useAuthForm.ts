import { useState } from "react";

interface UseAuthFormReturn {
  phone: string;
  password: string;
  isPhoneValid: boolean;
  isPasswordValid: boolean;
  errorPhoneMessage: string;
  errorPasswordMessage: string;
  phoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
}

const validatePhoneNumber = (number: string) => {
  const cleanNumber = number.replace(/\D/g, "");

  if (cleanNumber.length !== 11) {
    return {
      isValid: false,
      message: "手机号码应为11位数字",
    };
  }

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

const formatPhoneNumber = (number: string) => {
  const cleanNumber = number.replace(/\D/g, "");

  if (cleanNumber.length <= 3) {
    return cleanNumber;
  } else if (cleanNumber.length <= 7) {
    return `${cleanNumber.slice(0, 3)} ${cleanNumber.slice(3)}`;
  } else {
    return `${cleanNumber.slice(0, 3)} ${cleanNumber.slice(3, 7)} ${cleanNumber.slice(7, 11)}`;
  }
};

export const useAuthForm = (): UseAuthFormReturn => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [errorPhoneMessage, setErrorPhoneMessage] = useState("请输入有效的手机号码");
  const [errorPasswordMessage, setErrorPasswordMessage] = useState("密码不能为空");

  const phoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanValue = inputValue.replace(/\D/g, "");

    if (cleanValue.length <= 11) {
      const formattedValue = formatPhoneNumber(cleanValue);
      setPhone(formattedValue);

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
    setPassword(inputValue);
    if (inputValue.length === 0) {
      setIsPasswordValid(false);
      setErrorPasswordMessage("密码不能为空");
    } else if (inputValue.length < 6) {
      setIsPasswordValid(false);
      setErrorPasswordMessage("密码长度不能少于6位");
    } else {
      setIsPasswordValid(true);
      setErrorPasswordMessage("");
    }
  };

  const reset = () => {
    setPhone("");
    setPassword("");
    setIsPhoneValid(false);
    setIsPasswordValid(false);
    setErrorPhoneMessage("请输入有效的手机号码");
    setErrorPasswordMessage("密码不能为空");
  };

  return {
    phone,
    password,
    isPhoneValid,
    isPasswordValid,
    errorPhoneMessage,
    errorPasswordMessage,
    phoneChange,
    passwordChange,
    reset,
  };
};
