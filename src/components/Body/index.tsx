import classNames from "classnames"
import "./index.scss"
import Nav from "../Nav"
import { ArticlePreviewTagRes, fetchArticlePreviewsAPI } from "@/apis/article"
import { useEffect, useState } from "react"

const Body: React.FC = () => {
    const [articlePreviewTags, setArticlePreviewTags] = useState<ArticlePreviewTagRes[]>([])
    useEffect(() => {
        const getArticlePreviews = async () => {
            try {
                const res = await fetchArticlePreviewsAPI()
                setArticlePreviewTags(res.data.data.articlePreviewTags)
            } catch(err) {
                throw new Error('fetch articles error')
            }
        }
        getArticlePreviews()
    }, [])
    return (
        <div className={classNames('page-home')}>
            {articlePreviewTags.map(item => <Nav key={item.id} articlePreviewTag={item} />)}
        </div>
    )
}

export default Body