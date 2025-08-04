import classNames from "classnames"
import Img from "../../assets/img/logo-white.png"
import "./index.scss"

const Footer: React.FC = () => {
    return (
        <div className={classNames("footer-out")}>
            <div className={classNames("footer-img")}>
                <img src={Img}></img>
            </div>
            <div className={classNames("footer-title")}>xHHx的博客</div>
            <div className={classNames("footer-summary")}>这是作者对「编程」、「框架」和其他「技术」学习的记录</div>
        </div>
    )
}

export default Footer