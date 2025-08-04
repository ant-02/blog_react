import classNames from "classnames";
import { ArticleDTO } from "../../models/article";
import { Link } from "react-router-dom";
import "./index.scss";
import imgSrc from "../../assets/img/typescript.png";
import { getDateByFormat } from "../../utils/time";
import { useRef, useState } from "react";

interface ArticleProps {
  article: ArticleDTO;
}

type Rotation = {
  x: number;
  y: number;
};

const ArticleCard: React.FC<ArticleProps> = ({ article }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [rotation, setRotation] = useState<Rotation>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = (x - centerX) / 20;
    const rotateX = (centerY - y) / 20;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <Link
      to={`/article/` + article.id}
      ref={cardRef}
      className={classNames("articleCard-link")}
      style={{
        transform: `perspective(500px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={classNames("articleCard-container")}>
        <div className={classNames("articleCard-title")}>{article.title}</div>
        <div className={classNames("articleCard-date")}>
          <div className={classNames("articleCard-date-box")}>
            {getDateByFormat(article.updatedAt, "yyyy/MM/dd")}
          </div>
        </div>
      </div>
      <img
        className={classNames("articleCard-img")}
        src={article.coverImage.length === 0 ? imgSrc : article.coverImage}
      />
    </Link>
  );
};

export default ArticleCard;
