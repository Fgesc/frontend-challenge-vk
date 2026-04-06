import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CatImage } from '../types/cat'

const FAVORITES_STORAGE_KEY = 'favorite-cats'

function readFavoritesFromStorage(): Record<string, CatImage> {
    try {
        const rawValue = localStorage.getItem(FAVORITES_STORAGE_KEY)

        if (!rawValue) {
            return {}
        }

        const parsedValue = JSON.parse(rawValue) as unknown

        if (typeof parsedValue !== 'object' || parsedValue === null) {
            return {}
        }

        return parsedValue as Record<string, CatImage>
    } catch {
        return {}
    }
}

export function useFavorites() {
    const [favoritesById, setFavoritesById] = useState<Record<string, CatImage>>(
        () => readFavoritesFromStorage(),
    )

    useEffect(() => {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritesById))
    }, [favoritesById])

    const favoriteCats = useMemo(() => Object.values(favoritesById), [favoritesById])

    const isFavorite = useCallback(
        (catId: string) => {
            return Boolean(favoritesById[catId])
        },
        [favoritesById],
    )

    const toggleFavorite = useCallback((cat: CatImage) => {
        setFavoritesById((previousState) => {
            if (previousState[cat.id]) {
                const nextFavorites = { ...previousState }
                delete nextFavorites[cat.id]
                return nextFavorites
            }

            return {
                ...previousState,
                [cat.id]: cat,
            }
        })
    }, [])

    return {
        favoriteCats,
        isFavorite,
        toggleFavorite,
    }
}
