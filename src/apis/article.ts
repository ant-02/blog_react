import { http } from "@/ utils"
import type { ResType } from "./shared"

export type ArticlePreview = {
    id: number
    title: string
    thumbnail: string
    isTop: boolean
    viewCount: number
    isDeleted: boolean
    createdAt: string
}

export type ArticlePreviewRes = {
    articles: ArticlePreview[]
}

export const fetchArticlePreviewsAPI = () => {
    return http.request<ResType<ArticlePreviewRes>>({
        url: '/articleTags',
        method: 'GET',
    })
}

