import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchCats, PAGE_LIMIT } from '../api/cats'
import type { CatImage } from '../types/cat'

type UseCatsResult = {
    cats: CatImage[]
    isInitialLoading: boolean
    isLoadingMore: boolean
    errorMessage: string | null
    hasMore: boolean
    loadMore: () => void
}

function mergeUniqueCats(previousCats: CatImage[], newCats: CatImage[]): CatImage[] {
    const seenIds = new Set(previousCats.map((cat) => cat.id))
    const uniqueNewCats = newCats.filter((cat) => {
        if (seenIds.has(cat.id)) {
            return false
        }

        seenIds.add(cat.id)
        return true
    })

    return [...previousCats, ...uniqueNewCats]
}

export function useCats(): UseCatsResult {
    const [cats, setCats] = useState<CatImage[]>([])
    const [page, setPage] = useState(0)
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)

    const abortControllerRef = useRef<AbortController | null>(null)
    const requestIdRef = useRef(0)

    const loadPage = useCallback(async (targetPage: number) => {
        // Request versioning protects state from stale responses and StrictMode re-runs.
        const requestId = requestIdRef.current + 1
        requestIdRef.current = requestId

        const isFirstPage = targetPage === 0

        if (isFirstPage) {
            setIsInitialLoading(true)
        } else {
            setIsLoadingMore(true)
        }

        setErrorMessage(null)

        // Keep only one in-flight request: a newer load cancels the previous one.
        abortControllerRef.current?.abort()
        const controller = new AbortController()
        abortControllerRef.current = controller

        try {
            const nextCats = await fetchCats({ page: targetPage, signal: controller.signal })

            if (requestId !== requestIdRef.current) {
                return
            }

            setCats((previousCats) => mergeUniqueCats(previousCats, nextCats))
            setPage(targetPage)
            setHasMore(nextCats.length >= PAGE_LIMIT)
        } catch (error) {
            if (requestId !== requestIdRef.current) {
                return
            }

            if (!(error instanceof DOMException && error.name === 'AbortError')) {
                setErrorMessage('Не удалось загрузить котиков. Попробуйте позже.')
            }
        } finally {
            if (requestId === requestIdRef.current) {
                setIsInitialLoading(false)
                setIsLoadingMore(false)
            }
        }
    }, [])

    useEffect(() => {
        void loadPage(0)

        return () => {
            abortControllerRef.current?.abort()
        }
    }, [loadPage])

    const loadMore = useCallback(() => {
        if (!hasMore || isInitialLoading || isLoadingMore) {
            return
        }

        void loadPage(page + 1)
    }, [hasMore, isInitialLoading, isLoadingMore, loadPage, page])

    return {
        cats,
        isInitialLoading,
        isLoadingMore,
        errorMessage,
        hasMore,
        loadMore,
    }
}
