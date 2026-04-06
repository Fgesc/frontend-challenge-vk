import { useRef, useState } from 'react'
import { CatsPanel } from './components/CatsPanel/CatsPanel'
import { CatsTabs } from './components/CatsTabs/CatsTabs'
import { useInfiniteScroll } from './hooks/useInfiniteScroll'
import { useCats } from './hooks/useCats'
import { useFavorites } from './hooks/useFavorites'
import type { ActiveTab } from './types/ui'
import styles from './App.module.scss'

const EMPTY_PANEL_TEXT = 'Тут пока пусто. Добавьте котиков в любимые.'

function App() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('all')

    const { cats, isInitialLoading, isLoadingMore, errorMessage, hasMore, loadMore } = useCats()
    const { favoriteCats, isFavorite, toggleFavorite } = useFavorites()

    const loadMoreMarkerRef = useRef<HTMLDivElement | null>(null)

    useInfiniteScroll({
        enabled: activeTab === 'all',
        hasMore,
        isLoading: isInitialLoading || isLoadingMore,
        target: loadMoreMarkerRef,
        onLoadMore: loadMore,
    })

    return (
        <main className={styles.page}>
            <section className={styles.galleryCard}>
                <CatsTabs activeTab={activeTab} onChange={setActiveTab} />

                <CatsPanel
                    id="cats-panel-all"
                    labelledBy="cats-tab-all"
                    hidden={activeTab !== 'all'}
                    cats={cats}
                    emptyText={EMPTY_PANEL_TEXT}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                    isInitialLoading={isInitialLoading}
                    errorMessage={errorMessage}
                    loadMoreRef={loadMoreMarkerRef}
                    isLoadingMore={isLoadingMore}
                />

                <CatsPanel
                    id="cats-panel-favorites"
                    labelledBy="cats-tab-favorites"
                    hidden={activeTab !== 'favorites'}
                    cats={favoriteCats}
                    emptyText={EMPTY_PANEL_TEXT}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                />
            </section>
        </main>
    )
}

export default App
