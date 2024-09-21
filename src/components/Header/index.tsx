import "./index.scss"
import classNames from "classnames";
import { Input } from "antd";
import type { SearchProps } from 'antd/es/input/Search';

const Header: React.FC = () => {
  const getImageUrl = (name: string) => {
    return new URL(`../../assets/img/${name}.png`, import.meta.url).href
  }

  const { Search } = Input
  const onSearch: SearchProps['onSearch'] = (value) => {
      console.log(value)
  }

  return (
    <header>
        <div className={classNames('header-logo')}>
          <a href="/" className={classNames('logo')}>
            <img src={getImageUrl('logo-white')} />
            <span>博客</span>
          </a>
        </div>
        <nav>
          <ul>
            <li><a href="/">技术</a></li>
            <li><a href="/">算法</a></li>
            <li><a href="/">关于</a></li>
          </ul>
        </nav>
      
      <div className={classNames('menu-right')}>
        <Search placeholder="搜索" allowClear onSearch={onSearch} style={{ width: 200 }} />
      </div>
    </header>
  )
};

export default Header;