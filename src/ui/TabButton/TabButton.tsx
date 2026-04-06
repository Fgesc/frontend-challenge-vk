import { forwardRef, type KeyboardEvent } from 'react'
import styles from './TabButton.module.scss'

type TabButtonProps = {
    id?: string
    controlsId?: string
    isActive: boolean
    tabIndex?: number
    label: string
    onClick: () => void
    onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void
    className?: string
}

export const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(function TabButton(
    { id, controlsId, isActive, tabIndex = -1, label, onClick, onKeyDown, className = '' },
    ref,
) {
    return (
        <button
            ref={ref}
            id={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={controlsId}
            tabIndex={tabIndex}
            className={`${styles.button} ${isActive ? styles.active : ''} ${className}`}
            onClick={onClick}
            onKeyDown={onKeyDown}
        >
            {label}
        </button>
    )
})
