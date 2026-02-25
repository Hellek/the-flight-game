# Организация файлов

## Экспорты

### Именованные экспорты

- Использовать именованные экспорты (`export const`, `export function`, `export interface`)
- Избегать default экспортов для лучшей поддержки рефакторинга и автодополнения

```typescript
// Хорошо
export const GamePage = () => { /* ... */ }
export interface Aircraft { /* ... */ }
export class CityService { /* ... */ }

// Избегать
export default GamePage
```

### Импорты из core/di

Импортировать сущности из `@core/di` (barrel), не из вложенных модулей:

```typescript
// Хорошо
import { scope, createProvider, createWidget } from '@core/di'

// Избегать
import { scope } from '@core/di/scopeDecorators'
```

### Типизация props в model виджета

Если виджет принимает props от родителя, в модели объявить интерфейс (например, `CitiesModelProps`) и инжектировать в конструктор первым аргументом `Props<YourModelProps>` из `@core/di`. Подробнее — в [Стандарты написания кода](./coding-standards.md#типизация-входящих-props-в-viewmodel).

### Экспорт createProvider в model виджета

В `widgets/*/model/index.ts` результат `createProvider(SomeModel)` экспортировать одной строкой через `export const`, без промежуточной переменной. Подробнее — в [Стандарты написания кода](./coding-standards.md) (раздел DI).

### Barrel exports

- Создавать `index.ts` файлы для группировки экспортов
- Использовать `export * from` для реэкспорта

```typescript
// widgets/InfoPanelWidget/components/ — через index или явные экспорты
export * from './CityInfo'
export * from './RouteInfo'
export * from './AircraftInfo'
export * from './PanelHeader'
```

### Импорт из barrel exports

- Использовать групповые импорты из `index.ts` файлов

```typescript
// Хорошо
import { AircraftInfo, CityInfo, RouteInfo } from './components'

// Избегать (если есть index.ts)
import { AircraftInfo } from './components/CityInfo'
import { CityInfo } from './components/RouteInfo'
```

## Организация файлов

### Один элемент на файл

- Один компонент/класс/тип на файл
- Имя файла должно соответствовать имени экспортируемого элемента

```
src/widgets/
  GameWidget/           → export const GameWidget
  InfoPanelWidget/      → компоненты + model/
  MainMenuWidget/       → компоненты + model/
```

### Группировка связанных файлов

- Группировать связанные файлы в поддиректории
- Создавать поддиректории для компонентов с множественными файлами

```
src/widgets/
  InfoPanelWidget/
    CityInfo.tsx
    RouteInfo.tsx
    AircraftInfo.tsx
    model/
      index.ts
  MainMenuWidget/
    MainMenuWidget.tsx
    hooks/
    model/
      index.ts
```

### Структура директорий

Актуальная структура директорий и алиасы путей — в [docs/STRUCTURE.md](../docs/STRUCTURE.md). Плагины импортировать из `@plugins`, сервисы — из `@services`. Классы плагинов имеют суффикс "Plugin". Здесь сохраняются общие принципы: один элемент на файл, группировка в поддиректории, barrel-экспорты через `index.ts`.
