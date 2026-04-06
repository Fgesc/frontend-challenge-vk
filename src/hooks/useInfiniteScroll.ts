import { useEffect, type RefObject } from 'react'

type UseInfiniteScrollParams = {
    enabled: boolean
    hasMore: boolean
    isLoading: boolean
    target: RefObject<Element | null>
    onLoadMore: () => void
    rootMargin?: string
}

export function useInfiniteScroll({
    enabled,
    hasMore,
    isLoading,
    target,
    onLoadMore,
    rootMargin = '250px',
}: UseInfiniteScrollParams) {
    useEffect(() => {
        if (!enabled || !hasMore) {
            return
        }

        const markerElement = target.current
        if (!markerElement) {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries
                if (entry.isIntersecting && !isLoading) {
                    onLoadMore()
                }
            },
            { rootMargin },
        )

        observer.observe(markerElement)

        return () => {
            observer.disconnect()
        }
    }, [enabled, hasMore, isLoading, onLoadMore, rootMargin, target])
}
