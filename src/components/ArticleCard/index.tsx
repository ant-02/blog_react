import { ArticleDTO } from "../../models/article";
import { Link } from "react-router-dom";
import imgSrc from "../../assets/img/typescript.png";
import { getDateByFormat } from "../../utils/time";
import { useRef } from "react";

interface ArticleProps {
  article: ArticleDTO;
}

const ArticleCard: React.FC<ArticleProps> = ({ article }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = (x - centerX) / 20;
    const rotateX = (centerY - y) / 20;

    cardRef.current.style.setProperty("--rotate-x", `${rotateX}deg`);
    cardRef.current.style.setProperty("--rotate-y", `${rotateY}deg`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--rotate-x", "0deg");
    cardRef.current.style.setProperty("--rotate-y", "0deg");
  };

  return (
    <Link
      to={`/article/` + article.id}
      ref={cardRef}
      className="relative block h-64 w-[400px] transition-transform duration-300 ease-out"
      style={{
        transform:
          "perspective(500px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute z-[1] flex h-full w-full flex-col justify-between">
        <div className="mx-auto mt-5 text-[22px] font-bold text-white">{article.title}</div>
        <div className="m-5 flex flex-row-reverse items-start">
          <div className="rounded-[20px] bg-black/60 px-3 py-1.5 text-sm text-white">
            {getDateByFormat(article.updatedAt, "yyyy/MM/dd")}
          </div>
        </div>
      </div>
      <img
        className="block h-full w-full rounded-[32px]"
        src={article.coverImage || imgSrc}
        alt={article.title}
      />
    </Link>
  );
};

export default ArticleCard;
