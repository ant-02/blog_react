import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import logoWhite from "../../assets/img/logo-white.png";
import logoBlack from "../../assets/img/logo-black.png";
import { getInitialTheme } from "../../lib/theme";

const getLogoSrc = (theme: "light" | "dark" | undefined) =>
  theme === "dark" ? logoBlack : logoWhite;

const Footer: React.FC = () => {
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
    <div className="mt-[100px] flex flex-col items-center">
      <div>
        <img
          src={logoSrc}
          alt="xHHx的博客"
          className="h-[100px] w-[110px]"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 150ms ease" }}
        />
      </div>
      <div className="text-lg">xHHx的博客</div>
      <div className="mt-3 text-base font-light text-muted-foreground">
        这是作者对「编程」、「框架」和其他「技术」学习的记录
      </div>
    </div>
  );
};

export default Footer;
