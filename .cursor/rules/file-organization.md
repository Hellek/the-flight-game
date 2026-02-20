# Организация файлов

## Экспорты

### Именованные экспорты

- Использовать именованные экспорты (`export const`, `export function`, `export interface`)
- Избегать default экспортов для лучшей поддержки рефакторинга и автодополнения

```typescript
// Хорошо
export const GamePage: React.FC = () => { /* ... */ }
export interface Aircraft { /* ... */ }
export class AircraftStore { /* ... */ }

// Избегать
export default GamePage
```

### Barrel exports

- Создавать `index.ts` файлы для группировки экспортов
- Использовать `export * from` для реэкспорта

```typescript
// src/components/info-panel/index.ts
export * from './CityInfo'
export * from './RouteInfo'
export * from './AircraftInfo'
export * from './PanelHeader'
```

### Импорт из barrel exports

- Использовать групповые импорты из `index.ts` файлов

```typescript
// Хорошо
import { AircraftInfo, CityInfo, RouteInfo } from './info-panel'

// Избегать (если есть index.ts)
import { AircraftInfo } from './info-panel/AircraftInfo'
import { CityInfo } from './info-panel/CityInfo'
```

## Организация файлов

### Один элемент на файл

- Один компонент/класс/тип на файл
- Имя файла должно соответствовать имени экспортируемого элемента

```
src/components/
  Game.tsx          → export const Game
  InfoPanel.tsx     → export const InfoPanel
  Header.tsx        → export const Header
```

### Группировка связанных файлов

- Группировать связанные файлы в поддиректории
- Создавать поддиректории для компонентов с множественными файлами

```
src/components/
  info-panel/
    CityInfo.tsx
    RouteInfo.tsx
    AircraftInfo.tsx
    index.ts
  header/
    HeaderLeft.tsx
    ChangelogButton.tsx
    RouteToggle.tsx
    index.ts
```

### Структура директорий

#### Компоненты (`src/components/`)

- Основные компоненты в корне `components/`
- Группы компонентов в поддиректориях
- Каждая группа имеет `index.ts` для экспорта

#### Stores (`src/stores/`)

- Каждый store в отдельном файле
- `RootStore.ts` для объединения всех stores
- `index.ts` для экспорта `rootStore`

#### Типы (`src/types/`)

- Типы группируются по домену
- `types.ts` для основных типов
- Дополнительные файлы для специфичных доменов
- `index.ts` для экспорта всех типов

#### Утилиты (`src/utils/`)

- Каждая утилита в отдельном файле
- `index.ts` для экспорта всех утилит

#### Константы (`src/constants/`)

- Константы группируются по назначению
- `index.ts` для экспорта всех констант

#### Данные (`src/data/`)

- Статические данные в отдельных файлах
- `index.ts` для экспорта всех данных
