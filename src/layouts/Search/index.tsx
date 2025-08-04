import { useEffect, useState } from "react";
import "./index.scss";
import classNames from "classnames";
import SearchCard from "../../components/SearchCard";
import { useLocation } from "react-router-dom";

const Search: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const location = useLocation()
  useEffect(() => {
    setSearch("")
  }, [location])
  return (
    <div>
      <div className={classNames("search")}>
        <i className={classNames("iconfont icon-sousuo", "search-icon")}></i>
        <input
          placeholder="搜索"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          style={{ width: search === "" ? "132px" : "100px" }}
        ></input>
        <button
          className={classNames("search-clear")}
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
