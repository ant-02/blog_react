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

export type ArticlePreviewTagRes = {
    id: number
    name: string
    articlePreviews: ArticlePreview[]
}

export const fetchArticlePreviewsAPI = () => {
    return http.request<ResType<ArticlePreviewTagRes[]>>({
        url: '/articleTags',
        method: 'GET',
    })
}

export const fetchArticlePreviewsByTagAPI = (id : string) => {
    return http.request<ResType<ArticlePreviewTagRes>>({
        url: '/articleTag/' + id,
        method: 'GET'
    })
}