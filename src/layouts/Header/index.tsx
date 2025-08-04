import classNames from "classnames";
import logo_white from "../../assets/img/logo-white.png";
import "./index.scss";
import { Link } from "react-router-dom";
import Search from "../Search";
import Login from "../../layouts/Login";

const Header: React.FC = () => {
  return (
    <div className={classNames("header")}>
      <div className={classNames("header-logo")}>
        <Link to="/" className={classNames("logo")}>
          <img src={logo_white} />
          <span>博客</span>
        </Link>
      </div>
      <nav className={classNames("header-nav")}>
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to="/category">专题</Link>
          </li>
          <li>
            <Link to="/">关于</Link>
          </li>
        </ul>
      </nav>

      <div className={classNames("menu-right")}>
        <Search />
        <Login />
      </div>
    </div>
  );
};

export default Header;
