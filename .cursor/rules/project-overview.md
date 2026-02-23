# Обзор проекта

## Требования к окружению

- **Node.js**: версия 22
- **npm**: версия 9 или 10

## Основные зависимости

- `react`, `react-dom` — React
- `mobx`, `mobx-react-lite` — реактивное состояние (сервисы, ViewModel)
- `tsyringe`, `reflect-metadata` — DI-контейнер (`src/core/di/`)
- `@react-three/fiber`, `@react-three/drei` — 3D графика
- `three`, `@types/three` — Three.js
- `react-router-dom` — маршрутизация
- `tailwindcss`, `@tailwindcss/postcss` — стилизация
- `clsx`, `tailwind-merge` — утилиты для классов
- `lucide-react` — иконки
- `@floating-ui/react` — позиционирование

## Важные замечания

- Проект использует ES Modules (`"type": "module"`)
- Конфигурационные файлы — современный синтаксис (ESM)
- Структура: `widgets/`, `pages/`, `services/`, `plugins/`, `utils/`, `core/di/` — см. [docs/STRUCTURE.md](../../docs/STRUCTURE.md)
