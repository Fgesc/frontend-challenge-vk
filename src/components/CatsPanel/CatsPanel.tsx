import type { RefObject } from 'react'
import type { CatImage } from '../../types/cat'
import { CatCard } from '../CatCard/CatCard'
import styles from './CatsPanel.module.scss'

type CatsPanelProps = {
    id: string
    labelledBy: string
    hidden: boolean
    cats: CatImage[]
    emptyText: string
    isFavorite: (catId: string) => boolean
    onToggleFavorite: (cat: CatImage) => void
    isInitialLoading?: boolean
    errorMessage?: string | null
    loadMoreRef?: RefObject<HTMLDivElement | null>
    isLoadingMore?: boolean
}

export function CatsPanel({
    id,
    labelledBy,
    hidden,
    cats,
    emptyText,
    isFavorite,
    onToggleFavorite,
    isInitialLoading = false,
    errorMessage = null,
    loadMoreRef,
    isLoadingMore = false,
}: CatsPanelProps) {
    return (
        <div id={id} role="tabpanel" aria-labelledby={labelledBy} hidden={hidden} className={styles.gridWrapper}>
            {isInitialLoading ? <p className={styles.status}>Загружаем котиков...</p> : null}
            {errorMessage ? <p className={styles.statusError}>{errorMessage}</p> : null}
            {!isInitialLoading && !errorMessage && cats.length === 0 ? (
                <p className={styles.status}>{emptyText}</p>
            ) : null}

            <div className={styles.grid}>
                {cats.map((cat) => (
                    <CatCard
                        key={cat.id}
                        cat={cat}
                        isFavorite={isFavorite(cat.id)}
                        onToggleFavorite={onToggleFavorite}
                    />
                ))}
            </div>

            {loadMoreRef && !isInitialLoading && !errorMessage ? (
                <>
                    <div ref={loadMoreRef} className={styles.loadMoreMarker} />
                    {isLoadingMore ? (
                        <p className={styles.loadingLabel}>... загружаем еще котиков ...</p>
                    ) : null}
                </>
            ) : null}
        </div>
    )
}
