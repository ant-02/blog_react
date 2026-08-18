import { useEffect, useState } from "react";
import classNames from "classnames";
import SearchCard from "../../components/SearchCard";
import { useLocation } from "react-router-dom";

const Search: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const location = useLocation();
  useEffect(() => {
    setSearch("");
  }, [location]);
  return (
    <div className="relative">
      <div
        className={classNames(
          "flex h-[30px] items-center justify-center rounded-lg border border-border bg-background px-2",
          "focus-within:ring-2 focus-within:ring-ring"
        )}
      >
        <i className="iconfont icon-sousuo px-2 text-muted-foreground"></i>
        <input
          placeholder="搜索"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="border-none bg-transparent text-foreground outline-none"
          style={{ width: search === "" ? "132px" : "100px" }}
        />
        <button
          className="w-8 border-none bg-transparent text-xs text-foreground hover:text-primary"
          style={{ display: search === "" ? "none" : "flex" }}
          onClick={() => setSearch("")}
        >
          清除
        </button>
      </div>
      {search && <SearchCard val={search} />}
    </div>
  );
};

export default Search;
