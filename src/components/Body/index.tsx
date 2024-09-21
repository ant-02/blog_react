import classNames from "classnames"
import "./index.scss"
import Nav from "@/components/Nav"

const Body: React.FC = () => {
    return (
        <div className={classNames('page-home')}>
            <Nav />
        </div>
    )
}

export default Body