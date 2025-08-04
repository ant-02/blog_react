import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./index.scss";

interface MarkdownDisplayProps {
  markdownText?: string;
}

// interface CodeBlockProps {
//   children: string;
//   language: string;
// }

// const CodeBlock: React.FC<CodeBlockProps> = ({ children, language }) => {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(String(children)).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1000); // 2秒后恢复按钮文本
//     });
//   };

//   return (
//     <div>
//       <SyntaxHighlighter language={language} style={docco}>
//         {children}
//       </SyntaxHighlighter>
//       <button onClick={handleCopy}>{copied ? "复制成功！" : "复制"}</button>
//     </div>
//   );
// };

enum Scroll {
  up = -1,
  stay = 0,
  down = 1,
}

const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({
  markdownText = "",
}) => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isHovered, setIsHovered] = useState<number>(0);
  const [isManualScrolling, setIsManualScrolling] = useState<Scroll>(
    Scroll.stay
  );

  const headings = markdownText
    .split("\n")
    .filter((line) => line.startsWith("#"))
    .map((line) => ({
      level: line.split(" ")[0].length,
      text: line.replace(/^#+\s*/, ""),
    }));

  const handleNavClick = (id: number) => {
    if (sectionRefs.current[id]) {
      setActiveSection(id);
      setIsManualScrolling(Scroll.stay);
      sectionRefs.current[id].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const doScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    setIsManualScrolling(event.deltaY < 0 ? Scroll.up : Scroll.down);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScrolling === Scroll.stay) return;
  
      let lowestSection: number = -1;
      let maxBottom: number = -Infinity;
  
      sectionRefs.current.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.bottom > maxBottom && rect.bottom <= window.innerHeight) {
            maxBottom = rect.bottom;
            lowestSection = index;
          }
        }
      });
  
      if (lowestSection !== -1) {
        setActiveSection(lowestSection);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isManualScrolling]);

  return (
    <div className="markdown-container" onWheel={doScroll}>
      <div className="markdown-nav">
        {headings.length > 0 && (
          <nav>
            <ul>
              {headings.map((heading, index) => (
                <li
                  key={index}
                  onClick={() => handleNavClick(index)}
                  style={{
                    fontWeight: index === activeSection ? "bold" : "normal",
                    borderRight:
                      index === activeSection
                        ? "2px solid #7D7E87"
                        : "2px solid #eaeaea",
                  }}
                >
                  <a
                    href={`#heading-${index}`}
                    onMouseEnter={() => setIsHovered(index)}
                    onMouseLeave={() => setIsHovered(-1)}
                    style={{
                      color:
                        index === activeSection || index === isHovered
                          ? "black"
                          : "#7D7E87",
                    }}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <ReactMarkdown
        components={{
          h1: ({ children, ...props }) => (
            <h1
              id={`heading-${headings.findIndex((h) => h.text === children)}`}
              ref={(el) => {
                sectionRefs.current[
                  headings.findIndex((h) => h.text === children)
                ] = el;
              }}
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              id={`heading-${headings.findIndex((h) => h.text === children)}`}
              ref={(el) => {
                sectionRefs.current[
                  headings.findIndex((h) => h.text === children)
                ] = el;
              }}
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              id={`heading-${headings.findIndex((h) => h.text === children)}`}
              ref={(el) => {
                sectionRefs.current[
                  headings.findIndex((h) => h.text === children)
                ] = el;
              }}
              {...props}
            >
              {children}
            </h3>
          ),
        }}
      >
        {markdownText}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownDisplay;
