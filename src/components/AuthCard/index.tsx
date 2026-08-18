import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAPI, registerAPI } from "../../apis/user";
import { setToken } from "../../utils/auth";
import { login } from "../../stores/modules/userSlice";
import { useAuthForm } from "../../hooks/useAuthForm";

interface AuthCardProps {
  mode: "login" | "register";
  close: () => void;
  switchMode: () => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ mode, close, switchMode }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const isLogin = mode === "login";

  const {
    phone,
    password,
    isPhoneValid,
    isPasswordValid,
    errorPhoneMessage,
    errorPasswordMessage,
    phoneChange,
    passwordChange,
  } = useAuthForm();

  const handleSubmit = () => {
    setShowErrors(true);
    if (!isPhoneValid || !isPasswordValid) {
      if (!isPhoneValid) toast.error(errorPhoneMessage);
      if (!isPasswordValid) toast.error(errorPasswordMessage);
      return;
    }

    const request = async () => {
      try {
        const res = isLogin ? await loginAPI(phone, password) : await registerAPI(phone, password);

        if (res.status !== 200) {
          toast.error(isLogin ? "账号或密码错误" : "注册失败");
          return;
        }

        setToken(res.data.data.token);
        dispatch(login({ user: res.data.data.user }));
        close();
      } catch (e) {
        console.error(e);
        toast.error(isLogin ? "登录失败" : "注册失败");
      }
    };

    request();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative w-full max-w-[420px] rounded-2xl border border-border bg-card p-8 shadow-xl text-card-foreground">
        <button
          type="button"
          onClick={close}
          className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            {isLogin ? "账号登入" : "账号注册"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLogin ? "欢迎回来，请登录你的账号" : "创建一个新账号开始写作"}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">手机号码</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="请输入手机号码"
                value={phone}
                onChange={phoneChange}
                className="pl-9"
                maxLength={13}
              />
            </div>
            {showErrors && !isPhoneValid && (
              <p className="text-xs text-destructive">{errorPhoneMessage}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">密码</Label>
              {isLogin && (
                <Link to="/" className="text-xs text-primary hover:underline" onClick={close}>
                  忘记密码？
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="请输入密码"
                value={password}
                onChange={passwordChange}
                className="pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {showErrors && !isPasswordValid && (
              <p className="text-xs text-destructive">{errorPasswordMessage}</p>
            )}
          </div>

          <Button type="button" className="mt-2 w-full" onClick={handleSubmit}>
            {isLogin ? "登入" : "注册"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {isLogin ? (
              <>
                还没有账号？
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-medium text-primary hover:underline"
                >
                  立即注册
                </button>
              </>
            ) : (
              <>
                已有账号？
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-medium text-primary hover:underline"
                >
                  直接登入
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AuthCard;
