import styles from './FavoriteButton.module.scss'

type FavoriteButtonProps = {
    isActive: boolean
    onClick: () => void
}

export function FavoriteButton({ isActive, onClick }: FavoriteButtonProps) {
    return (
        <button
            type="button"
            className={`${styles.button} ${isActive ? styles.active : ''}`}
            onClick={onClick}
            aria-label={isActive ? 'Убрать из любимых' : 'Добавить в любимые'}
        >
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4C8.24 4 9.91 4.81 11 6.08A6.1 6.1 0 0 1 11.35 6.53c.22.31.73.31.95 0 .12-.17.24-.32.35-.45C14.09 4.81 15.76 4 17.5 4A4.5 4.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.5L12 21.35Z" />
            </svg>
        </button>
    )
}
