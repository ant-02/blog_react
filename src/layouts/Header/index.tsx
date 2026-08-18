import classNames from "classnames";
import logo_white from "../../assets/img/logo-white.png";
import logo_black from "../../assets/img/logo-black.png";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import Search from "../Search";
import Login from "../../layouts/Login";
import ThemeToggle from "../../components/ThemeToggle";
import { getInitialTheme } from "../../lib/theme";
import { useEffect, useState } from "react";

const getLogoSrc = (theme: "light" | "dark" | undefined) =>
  theme === "dark" ? logo_black : logo_white;

const Header: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [logoSrc, setLogoSrc] = useState(() => getLogoSrc(getInitialTheme()));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (resolvedTheme) {
      setLogoSrc(getLogoSrc(resolvedTheme as "light" | "dark"));
    }
  }, [resolvedTheme]);

  return (
    <div
      className={classNames(
        "fixed left-0 top-0 z-10 flex w-full items-center py-1 backdrop-blur-xl backdrop-saturate-150",
        resolvedTheme === "dark" ? "bg-[#252232]/85" : "bg-white/85"
      )}
    >
      <div className="ml-5">
        <Link to="/" className="flex items-center whitespace-nowrap font-bold text-foreground">
          <img
            src={logoSrc}
            alt="博客 logo"
            className="h-[50px] w-[55px]"
            style={{ opacity: mounted ? 1 : 0, transition: "opacity 150ms ease" }}
          />
          <span className="ml-1 text-xl">博客</span>
        </Link>
      </div>
      <nav className="ml-5 flex items-center whitespace-nowrap">
        <ul className="flex list-none whitespace-nowrap p-0">
          <li className="px-2.5 py-2.5">
            <Link to="/" className="text-foreground hover:text-primary">
              首页
            </Link>
          </li>
          <li className="px-2.5 py-2.5">
            <Link to="/category" className="text-foreground hover:text-primary">
              专题
            </Link>
          </li>
          <li className="px-2.5 py-2.5">
            <Link to="/" className="text-foreground hover:text-primary">
              关于
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mr-5 flex w-full items-center justify-end gap-2">
        <ThemeToggle />
        <Search />
        <Login />
      </div>
    </div>
  );
};

export default Header;
