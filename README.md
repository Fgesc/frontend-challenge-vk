## Функциональность
- По умолчанию открывается вкладка **Все котики**
- Можно добавлять и убирать котиков из избранного
- Избранное хранится на клиенте (`localStorage`)
- Во вкладке **Любимые котики** отображаются добавленные котики
- Есть адаптивная сетка
- Есть бесконечная подгрузка по скроллу

## Стек
- React 19 + TypeScript + Vite
- SCSS Modules
- Vitest + Testing Library

## Запуск
```bash
npm install
npm run dev
```

## Переменные окружения
Можно запускать без API ключа.
Для расширенного доступа к TheCatAPI создайте `.env.local`:
```env
VITE_CAT_API_KEY=your_api_key
```
Без API key TheCatAPI ограничивает выдачу (`limit <= 10`).

## Скрипты
```bash
npm run dev
npm run lint
npm run test
npm run build
npm run preview
```
