import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import { Link } from "react-router-dom";
import { useState } from "react";
import Img from "../../assets/img/logo-white.png";
import AuthCard from "../../components/AuthCard";
import { Button } from "@/components/ui/button";

const Login: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [isShow, setIsShow] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  const handleClose = () => {
    setIsShow(false);
    setMode("login");
  };

  return (
    <div className="ml-5">
      {user ? (
        <Link to="/user">
          <img
            src={user.avatar || Img}
            alt="avatar"
            className="h-8 w-8 rounded-full border border-border object-cover"
          />
        </Link>
      ) : (
        <div>
          <Button variant="outline" size="sm" onClick={() => setIsShow(true)}>
            登入
          </Button>
          {isShow && (
            <AuthCard
              mode={mode}
              close={handleClose}
              switchMode={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Login;
