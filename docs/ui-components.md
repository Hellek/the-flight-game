# UI-компоненты и дизайн-система

Документация по созданию и использованию UI-компонентов в проекте.

## Стек

- **shadcn/ui** (стиль new-york) — примитивы на базе Radix UI
- **Tailwind CSS v4** — стилизация, тема через CSS-переменные
- **Утилита `cn`** — `src/utils/cn.ts` (объединение классов через `clsx` + `tailwind-merge`)

Конфигурация shadcn: `components.json` в корне проекта.

## Структура `src/components/ui/`

```
src/components/ui/
├── index.ts          # Публичные экспорты: обёртки + примитивы shadcn
├── wrappers.tsx      # Обёртки с API приложения (Button, Checkbox, Select)
├── Button.tsx        # Примитив shadcn (button)
├── Checkbox.tsx      # Примитив shadcn (checkbox)
├── Select.tsx        # Примитив shadcn (select)
├── Heading.tsx       # Кастомный компонент (типографика)
└── ...              # Другие примитивы, добавленные через CLI
```

- **Примитивы** — компоненты из shadcn (можно перезаписывать через `npx shadcn@canary add <name> --overwrite`).
- **Обёртки** — в `wrappers.tsx`: упрощённый/единый API для приложения (виджеты импортируют из `@components/ui` именно их).
- **Экспорты** — в `index.ts`: наружу отдаются обёртки под именами `Button`, `Checkbox`, `Select`; примитивы — под префиксом `Shadcn*` или отдельными именами (например, `SelectTrigger`, `SelectContent`).

## Добавление нового компонента через shadcn

1. Установить компонент (Tailwind v4 — canary):

   ```bash
   npx shadcn@canary add <component-name> --overwrite
   ```

   Примеры: `card`, `input`, `dialog`, `label`, `tabs`.

2. Имена файлов в `src/components/ui/` совпадают с именами от CLI в **PascalCase** (например, после добавления `card` может появиться `Card.tsx` — при необходимости переименуй файл для единообразия с существующими).

3. Заменить импорт утилиты в новом файле:

   - Было: `import { cn } from "@/lib/utils"`
   - Должно быть: `import { cn } from "@utils/cn"`

4. Добавить экспорты в `src/components/ui/index.ts`:
   - Нужна обёртка с упрощённым API → реализовать в `wrappers.tsx` и экспортировать из `index.ts` под основным именем.
   - Достаточно примитива → экспортировать из соответствующего файла (например, `export { Card } from './Card'`).

## Создание обёртки (упрощённый API)

Если компонент должен иметь упрощённый или отличный от shadcn API:

1. В `wrappers.tsx`:
   - Импортировать примитив из соответствующего файла (например, `./Card`).
   - Реализовать компонент с нужными пропсами и поведением.
   - Экспортировать под именем, под которым он будет публичным (например, `Card`).

2. В `index.ts`:
   - Экспортировать обёртку как основной экспорт: `export { Card } from './wrappers';`
   - При необходимости экспортировать примитив под другим именем: `export { Card as ShadcnCard } from './Card';`

Виджеты и страницы импортируют только из `@components/ui` (они получают обёртки).

## Стили и тема

- Цвета и радиусы задаются CSS-переменными в `src/index.css` (`:root`, `.dark`, `@theme inline`).
- В компонентах использовать токены Tailwind: `bg-primary`, `text-foreground`, `border-input`, `rounded-md` и т.д., а не жёсткие цвета (например, не `bg-blue-600`).
- Для объединения классов всегда использовать `cn()` из `@utils/cn`.

## Иконки

- **lucide-react** — основной набор иконок (указан в `components.json` как `iconLibrary: "lucide"`).
- Импорт: `import { IconName } from 'lucide-react';`

## Полезные команды

| Действие | Команда |
|----------|--------|
| Добавить компонент | `npx shadcn@canary add <name> --overwrite` |
| Добавить несколько | `npx shadcn@canary add card input dialog --overwrite` |
| Список компонентов | [ui.shadcn.com/docs](https://ui.shadcn.com/docs) |

## Ссылки

- [shadcn/ui + Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4)
- [Theming (CSS variables)](https://ui.shadcn.com/docs/theming)
- Локальные правила стилей: `.cursor/rules/styling-rules.md`
