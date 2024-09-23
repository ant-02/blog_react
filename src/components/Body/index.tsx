import classNames from "classnames"
import "./index.scss"
import Nav from "../Nav"
import { ArticlePreview, fetchArticlePreviewsAPI } from "@/apis/article"
import { useEffect, useState } from "react"

const Body: React.FC = () => {
    const [articlePreviews, setArticlePreviews] = useState<ArticlePreview[]>([])
    useEffect(() => {
        const getArticlePreviews = async () => {
            try {
                const res = await fetchArticlePreviewsAPI()
                console.log("-------", res)
                setArticlePreviews(res.data.data.articles)
            } catch(err) {
                throw new Error('fetch articles error')
            }
        }
        getArticlePreviews()
    }, [])
    
    console.log(articlePreviews)
    return (
        <div className={classNames('page-home')}>
            <Nav />
        </div>
    )
}

export default Body