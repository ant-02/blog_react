import classNames from "classnames"
import "./index.scss"
import Nav from "../Nav"
import { ArticlePreviewTagRes, fetchArticlePreviewsByTagAPI } from "@/apis/article"
import { useEffect, useState } from "react"

const ClassifierBody: React.FC = () => {
    const [articlePreviewTag, setArticlePreviewTag] = useState<ArticlePreviewTagRes>()
    useEffect(() => {
        const getArticlePreviews = async () => {
            try {
                const res = await fetchArticlePreviewsByTagAPI("1")
                setArticlePreviewTag(res.data.data)
            } catch(err) {
                throw new Error('fetch articles error')
            }
        }
        getArticlePreviews()
    }, [])
    
    return (
        <div className={classNames('page-home')}>
            <Nav articlePreviewTag={articlePreviewTag} />
        </div>
    )
}

export default ClassifierBody