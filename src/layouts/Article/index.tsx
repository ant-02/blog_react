import { useEffect, useRef, useState } from "react";
import { fetchArticleAPI } from "../../apis/article";
import { Article as ArticleModel } from "../../models/article";
import classNames from "classnames";
import "./index.scss";
import { Link, useParams } from "react-router-dom";
import Img from "../../assets/img/typescript.png";
import { fetchUserDTOByIdAPI } from "../../apis/user";
import { UserDTO } from "../../models/user";
import Avatar from "../../assets/img/logo-white.png";
import { getDateByFormat } from "../../utils/time";
import { Markdown } from "@ant-design/pro-editor";
import MarkdownNav from "../../components/MarkdownNav";
import rehypeSlug from "rehype-slug";

enum Scroll {
  up = -1,
  stay = 0,
  down = 1,
}

const Article: React.FC = () => {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState<number>(0);
  const [article, setArticle] = useState<ArticleModel | null>(null);
  const [author, setAuthor] = useState<UserDTO | null>(null);
  const [isManualScrolling, setIsManualScrolling] = useState<Scroll>(
    Scroll.stay
  );
  const contentRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);

  const doScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    setIsManualScrolling(event.deltaY < 0 ? Scroll.up : Scroll.down);
  };

  useEffect(() => {
    if (!contentRef.current || headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetId = entry.target.id;
            const index = headings.findIndex((h) => h.id === targetId);
            if (index !== -1 && isManualScrolling === Scroll.stay) {
              console.log("yes")
              setActiveSection(index);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -50% 0px", // 当标题进入视口中部时触发
        threshold: 0.5,
      }
    );

    // 监听所有标题
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings, isManualScrolling]);

  useEffect(() => {
    if (!id) return;
    const getArticleById = async () => {
      try {
        const res1 = await fetchArticleAPI(id);
        const res2 = await fetchUserDTOByIdAPI(
          res1.data.data.authorId.toString()
        );
        setArticle(res1.data.data);
        setAuthor(res2.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getArticleById();
  }, [id]);

  useEffect(() => {
    if (!contentRef.current || !article?.content) return;

    const headingElements = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const extractedHeadings = Array.from(headingElements).map((el) => ({
      id: el.id,
      text: el.textContent || "",
    }));
    setHeadings(extractedHeadings);
  }, [article]);

  return (
    <div className={classNames("out-article")}>
      <div className={classNames("in-article")}>
        <img
          src={article?.coverImage || Img}
          className={classNames("article-img")}
        ></img>
        <div className={classNames("article-title")}>{article?.title}</div>
        <div className={classNames("article-author")}>
          <Link
            to="/author"
            state={{ author: author }}
            className={classNames("article-author-box")}
          >
            <img
              src={author?.avatar || Avatar}
              className={classNames("article-author-avatar")}
            ></img>
            <span>{author?.username}</span>
          </Link>
          <div>
            {article === null
              ? "0000/00/00"
              : getDateByFormat(article?.createdAt, "yyyy/MM/dd")}
          </div>
        </div>
        <div className={classNames("article-summary")}>
          <p>{article?.summary}</p>
        </div>
        <MarkdownNav
          markdownText={article == null ? "" : article.content}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <div ref={contentRef} onWheel={doScroll}>
          <Markdown rehypePlugins={[rehypeSlug]}>{article?.content}</Markdown>
        </div>
      </div>
    </div>
  );
};

export default Article;
