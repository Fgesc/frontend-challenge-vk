import type { CatImage } from '../types/cat'

const CATS_API_URL = 'https://api.thecatapi.com/v1/images/search'
const API_KEY = import.meta.env.VITE_CAT_API_KEY?.trim()
const PAGE_LIMIT = API_KEY ? 20 : 10

export type FetchCatsParams = {
    page: number
    signal?: AbortSignal
}

function isCatImage(value: unknown): value is CatImage {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    const candidate = value as Partial<CatImage>
    return (
        typeof candidate.id === 'string' &&
        typeof candidate.url === 'string' &&
        typeof candidate.width === 'number' &&
        typeof candidate.height === 'number'
    )
}

export async function fetchCats({ page, signal }: FetchCatsParams): Promise<CatImage[]> {
    const searchParams = new URLSearchParams({
        limit: String(PAGE_LIMIT),
        page: String(page),
        order: 'DESC',
    })

    const requestHeaders = API_KEY
        ? {
              'x-api-key': API_KEY,
          }
        : undefined

    const response = await fetch(`${CATS_API_URL}?${searchParams.toString()}`, {
        signal,
        headers: requestHeaders,
    })

    if (!response.ok) {
        throw new Error('Не удалось загрузить котиков. Попробуйте обновить страницу.')
    }

    const data = (await response.json()) as unknown

    if (!Array.isArray(data)) {
        return []
    }

    return data.filter(isCatImage)
}

export { PAGE_LIMIT }
