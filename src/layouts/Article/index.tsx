import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Img from "../../assets/img/typescript.png";
import Avatar from "../../assets/img/logo-white.png";
import { getDateByFormat } from "../../utils/time";
import MarkdownNav from "../../components/MarkdownNav";
import rehypeSlug from "rehype-slug";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import Loading from "../../components/Loading";
import { useGetArticleByIdQuery, useGetUserDTOByIdQuery } from "../../services/api";
import "github-markdown-css/github-markdown-light.css";

enum Scroll {
  up = -1,
  stay = 0,
  down = 1,
}

const Article: React.FC = () => {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isManualScrolling, setIsManualScrolling] = useState<Scroll>(Scroll.stay);
  const contentRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);

  const { data: article, isLoading: isArticleLoading } = useGetArticleByIdQuery(id ?? "", {
    skip: !id,
  });
  const { data: author } = useGetUserDTOByIdQuery(String(article?.authorId ?? ""), {
    skip: !article?.authorId,
  });

  const rehypePlugins = useMemo(() => [rehypeSlug, rehypeHighlight], []);

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
              setActiveSection(index);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -50% 0px",
        threshold: 0.5,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings, isManualScrolling]);

  useEffect(() => {
    if (!contentRef.current || !article?.content) return;

    const headingElements = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const extractedHeadings = Array.from(headingElements).map((el) => ({
      id: el.id,
      text: el.textContent || "",
    }));
    setHeadings(extractedHeadings);
  }, [article]);

  if (isArticleLoading || !article) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center pt-[70px]">
      <div className="w-[768px] max-w-full px-4">
        <img
          src={article.coverImage || Img}
          className="mt-5 block h-full w-full rounded-2xl"
          alt={article.title}
        />
        <div className="mt-[60px] text-left text-[40px] font-bold">{article.title}</div>
        <div className="mt-[30px] flex justify-between text-muted-foreground">
          <Link
            to="/author"
            state={{ author }}
            className="flex h-8 items-center rounded-[25px] p-2 transition-colors hover:bg-accent"
          >
            <img
              src={author?.avatar || Avatar}
              className="h-8 w-8 rounded-full object-cover"
              alt={author?.username || "作者"}
            />
            <span className="mx-2.5 text-base text-foreground">{author?.username}</span>
          </Link>
          <div>{getDateByFormat(article.createdAt, "yyyy/MM/dd")}</div>
        </div>
        <div className="mt-10">
          <p className="text-base text-muted-foreground">{article.summary}</p>
        </div>
        <MarkdownNav
          markdownText={article.content}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <div ref={contentRef} onWheel={doScroll} className="markdown-body">
          <ReactMarkdown rehypePlugins={rehypePlugins}>{article.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Article;
