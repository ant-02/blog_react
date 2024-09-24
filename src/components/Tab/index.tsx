import classNames from 'classnames'
import './index.scss'

const Tab: React.FC = (props) => {
    return (
        <div className={classNames('tab')}>
            <a className={classNames('post-card')}>
                {props.articlePreview.title}
            </a>
        </div>
    )
}

export default Tab