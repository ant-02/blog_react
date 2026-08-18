import { useMemo, useState } from "react";
import { generateSlugId } from "../../utils/rehypeSlug";

interface MarkdownNavProps {
  markdownText: string;
  activeSection: number;
  setActiveSection: (val: number) => void;
}

interface Heading {
  id: string;
  level: number;
  text: string;
}

const parseHeadings = (markdownText: string): Heading[] => {
  const existingIds = new Set<string>();
  return markdownText
    .split("\n")
    .filter((line) => line.startsWith("#"))
    .map((line) => {
      const level = line.split(" ")[0].length;
      const text = line.replace(/^#+\s*/, "");
      const id = generateSlugId(text, {}, existingIds);
      return { id, level, text };
    });
};

const MarkdownNav: React.FC<MarkdownNavProps> = ({
  markdownText,
  activeSection,
  setActiveSection,
}) => {
  const [isHovered, setIsHovered] = useState<number>(-1);
  const headings = useMemo(() => parseHeadings(markdownText), [markdownText]);

  const handleNavClick = (id: number) => {
    setActiveSection(id);
  };

  return (
    <div className="markdown-nav fixed left-0 top-[100px]">
      {headings.length > 0 && (
        <nav className="m-0">
          <ul className="block list-none flex-col">
            {headings.map((heading, index) => {
              const isActive = index === activeSection;
              const isHover = index === isHovered;
              return (
                <li
                  key={heading.id}
                  onClick={() => handleNavClick(index)}
                  className={`w-[250px] cursor-pointer border-r-2 py-0 ${
                    isActive ? "border-muted-foreground font-bold" : "border-border"
                  }`}
                >
                  <a
                    href={"#" + heading.id}
                    onMouseEnter={() => setIsHovered(index)}
                    onMouseLeave={() => setIsHovered(-1)}
                    className={`block px-[50px] text-sm leading-7 ${
                      isActive || isHover ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MarkdownNav;
