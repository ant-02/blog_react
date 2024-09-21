import classNames from "classnames"
import "./index.scss"
import Tab from "@/components/Tab"

const Nav: React.FC = () => {
    return (
        <div className={classNames('warp')}>
            <div className={classNames('title')}>Java</div>
            <Tab />
            <Tab />
            <Tab />
            <div className={classNames('more-row')}>
                <a className={classNames('more-but')} href="">更多</a>
            </div>
        </div>
    )
}

export default Nav