import classNames from "classnames"
import "./index.scss"
import Tab from "../Tab"

const Nav: React.FC = (props) => {
    return (
        <div className={classNames('warp')}>
            <div className={classNames('title')}>{props.articlePreviewTag.name}</div>
            {props.articlePreviewTag.articlePreviews.map(item => <Tab key={item.id} articlePreview={item} />)}
            <div className={classNames('more-row')}>
                <a className={classNames('more-but')} href="">更多</a>
            </div>
        </div>
    )
}

export default Nav