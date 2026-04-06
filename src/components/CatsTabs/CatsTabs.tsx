import { useRef, type KeyboardEvent } from 'react'
import { TabButton } from '../../ui/TabButton/TabButton'
import type { ActiveTab } from '../../types/ui'
import styles from './CatsTabs.module.scss'

type CatsTabsProps = {
    activeTab: ActiveTab
    onChange: (tab: ActiveTab) => void
}

export function CatsTabs({ activeTab, onChange }: CatsTabsProps) {
    const allTabRef = useRef<HTMLButtonElement | null>(null)
    const favoritesTabRef = useRef<HTMLButtonElement | null>(null)

    const tabsOrder: ActiveTab[] = ['all', 'favorites']
    const currentIndex = tabsOrder.indexOf(activeTab)

    const focusTab = (tab: ActiveTab) => {
        const targetRef = tab === 'all' ? allTabRef : favoritesTabRef
        targetRef.current?.focus()
        onChange(tab)
    }

    const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault()
            const nextIndex = (currentIndex + 1) % tabsOrder.length
            focusTab(tabsOrder[nextIndex])
            return
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault()
            const previousIndex = (currentIndex - 1 + tabsOrder.length) % tabsOrder.length
            focusTab(tabsOrder[previousIndex])
            return
        }

        if (event.key === 'Home') {
            event.preventDefault()
            focusTab('all')
            return
        }

        if (event.key === 'End') {
            event.preventDefault()
            focusTab('favorites')
        }
    }

    return (
        <nav className={styles.tabs} role="tablist" aria-label="Навигация по спискам котиков">
            <TabButton
                id="cats-tab-all"
                controlsId="cats-panel-all"
                isActive={activeTab === 'all'}
                tabIndex={activeTab === 'all' ? 0 : -1}
                label="Все котики"
                onClick={() => onChange('all')}
                onKeyDown={handleTabKeyDown}
                ref={allTabRef}
                className={styles.allTab}
            />
            <TabButton
                id="cats-tab-favorites"
                controlsId="cats-panel-favorites"
                isActive={activeTab === 'favorites'}
                tabIndex={activeTab === 'favorites' ? 0 : -1}
                label="Любимые котики"
                onClick={() => onChange('favorites')}
                onKeyDown={handleTabKeyDown}
                ref={favoritesTabRef}
                className={styles.favoritesTab}
            />
        </nav>
    )
}
