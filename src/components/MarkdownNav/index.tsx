import { useState } from "react";
import "./index.scss";
import { generateSlugId } from "../../utils/rehypeSlug";

interface MarkdownNavProps {
  markdownText: string;
  activeSection: number;
  setActiveSection: (val: number) => void;
}

const MarkdownNav: React.FC<MarkdownNavProps> = ({
  markdownText,
  activeSection,
  setActiveSection,
}) => {
  const [isHovered, setIsHovered] = useState<number>(0);
  const headings = markdownText
    .split("\n")
    .filter((line) => line.startsWith("#"))
    .map((line) => ({
      level: line.split(" ")[0].length,
      text: line.replace(/^#+\s*/, ""),
    }));

  const handleNavClick = (id: number) => {
    setActiveSection(id);
  };
  return (
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
                  href={"#" + generateSlugId(heading.text)}
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
  );
};

export default MarkdownNav;
