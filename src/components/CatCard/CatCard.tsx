import type { CatImage } from '../../types/cat'
import { FavoriteButton } from '../../ui/FavoriteButton/FavoriteButton'
import styles from './CatCard.module.scss'

type CatCardProps = {
    cat: CatImage
    isFavorite: boolean
    onToggleFavorite: (cat: CatImage) => void
}

export function CatCard({ cat, isFavorite, onToggleFavorite }: CatCardProps) {
    return (
        <article className={styles.card}>
            <img className={styles.image} src={cat.url} alt="Котик" loading="lazy" />
            <div className={styles.favoriteControl}>
                <FavoriteButton isActive={isFavorite} onClick={() => onToggleFavorite(cat)} />
            </div>
        </article>
    )
}
