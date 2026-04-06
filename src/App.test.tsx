import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import type { CatImage } from './types/cat'

const mockCats: CatImage[] = [
    { id: 'cat-1', url: 'https://cdn2.thecatapi.com/images/cat-1.jpg', width: 400, height: 300 },
    { id: 'cat-2', url: 'https://cdn2.thecatapi.com/images/cat-2.jpg', width: 450, height: 320 },
]

function mockCatsApiResponse(cats: CatImage[]) {
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
        const requestUrl = String(input)
        const parsedUrl = new URL(requestUrl)
        const page = parsedUrl.searchParams.get('page')
        const payload = page === '0' ? cats : []

        return {
            ok: true,
            json: async () => payload,
        } as Response
    })

    vi.stubGlobal('fetch', fetchMock)
}

describe('App smoke', () => {
    beforeEach(() => {
        localStorage.clear()
        mockCatsApiResponse(mockCats)
    })

    it('opens with "Все котики" tab active by default', async () => {
        render(<App />)
        const allPanel = screen.getByRole('tabpanel', { name: 'Все котики' })

        await waitFor(() => {
            expect(within(allPanel).getAllByAltText('Котик')).toHaveLength(2)
        })

        expect(screen.getByRole('tab', { name: 'Все котики' })).toHaveAttribute('aria-selected', 'true')
        expect(screen.getByRole('tab', { name: 'Любимые котики' })).toHaveAttribute('aria-selected', 'false')
    })

    it('adds and removes cat from favorites', async () => {
        const user = userEvent.setup()
        render(<App />)
        const allPanel = screen.getByRole('tabpanel', { name: 'Все котики' })

        await waitFor(() => {
            expect(within(allPanel).getAllByRole('button', { name: 'Добавить в любимые' }).length).toBeGreaterThan(
                0,
            )
        })

        await user.click(within(allPanel).getAllByRole('button', { name: 'Добавить в любимые' })[0])
        await user.click(screen.getByRole('tab', { name: 'Любимые котики' }))

        const favoritesPanel = screen.getByRole('tabpanel', { name: 'Любимые котики' })
        expect(within(favoritesPanel).getAllByAltText('Котик')).toHaveLength(1)
        expect(within(favoritesPanel).getByRole('button', { name: 'Убрать из любимых' })).toBeInTheDocument()

        await user.click(within(favoritesPanel).getByRole('button', { name: 'Убрать из любимых' }))
        expect(within(favoritesPanel).getByText('Тут пока пусто. Добавьте котиков в любимые.')).toBeInTheDocument()
    })

    it('restores favorites from localStorage on page load', async () => {
        localStorage.setItem(
            'favorite-cats',
            JSON.stringify({
                [mockCats[0].id]: mockCats[0],
            }),
        )

        const user = userEvent.setup()
        render(<App />)

        await user.click(screen.getByRole('tab', { name: 'Любимые котики' }))
        const favoritesPanel = screen.getByRole('tabpanel', { name: 'Любимые котики' })

        expect(await within(favoritesPanel).findByAltText('Котик')).toBeInTheDocument()
        expect(within(favoritesPanel).getByRole('button', { name: 'Убрать из любимых' })).toBeInTheDocument()
    })

    it('switches tabs with ArrowRight and ArrowLeft keys', async () => {
        const user = userEvent.setup()
        render(<App />)

        const allTab = screen.getByRole('tab', { name: 'Все котики' })
        const favoritesTab = screen.getByRole('tab', { name: 'Любимые котики' })

        allTab.focus()
        expect(allTab).toHaveFocus()
        expect(allTab).toHaveAttribute('aria-selected', 'true')
        expect(favoritesTab).toHaveAttribute('aria-selected', 'false')

        await user.keyboard('{ArrowRight}')

        expect(favoritesTab).toHaveFocus()
        expect(favoritesTab).toHaveAttribute('aria-selected', 'true')
        expect(allTab).toHaveAttribute('aria-selected', 'false')

        await user.keyboard('{ArrowLeft}')

        expect(allTab).toHaveFocus()
        expect(allTab).toHaveAttribute('aria-selected', 'true')
        expect(favoritesTab).toHaveAttribute('aria-selected', 'false')
    })
})
