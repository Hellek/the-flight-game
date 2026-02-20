# Стандарты написания кода

## TypeScript типизация

### Общие правила

- Все компоненты должны иметь явную типизацию props через интерфейсы
- Избегать `any` - использовать `unknown` если тип неизвестен
- Использовать union types для ограниченных наборов значений

## Именование

### Типы и интерфейсы

- Использовать PascalCase для типов, интерфейсов и enum
- Примеры: `Aircraft`, `Route`, `AircraftSize`, `Coordinates`

```typescript
export interface Aircraft {
  id: string
  type: AircraftSize
  // ...
}

export enum AircraftSize {
  small = 'small',
  medium = 'medium',
  // ...
}
```

## Компоненты

### Функциональные компоненты

- Использовать функциональные компоненты с TypeScript
- Типизировать props через интерфейс и указывать тип **в параметрах функции**, не использовать `React.FC`
- Формат: `export const ComponentName = ({ prop1, prop2 }: Props) => { ... }`

```tsx
interface AircraftInfoProps {
  aircraft: Aircraft
  onSelect: (aircraft: Aircraft) => void
}

export const AircraftInfo = ({ aircraft, onSelect }: AircraftInfoProps) => {
  return (
    // ...
  )
}
```

Для компонентов без props: `export const Page = () => { ... }` (тип параметра не указывать).

### MobX компоненты

- Для MobX компонентов всегда использовать `observer` из `mobx-react-lite`
- `observer` должен оборачивать весь компонент
- Внутри `observer` использовать именованную функцию для лучшей отладки в React DevTools

```tsx
import { observer } from 'mobx-react-lite'

export const InfoPanel = observer(function InfoPanel() {
  const { selectedEntity } = rootStore.selection
  // ...
})
```

### Типизация props

- Всегда определять интерфейс для props компонента
- Использовать деструктуризацию для props и указывать тип после деструктуризации: `({ a, b }: Props)`
- Избегать `any` в типах props

```tsx
interface CityInfoProps {
  city: City
  onClose?: () => void
}

export const CityInfo = ({ city, onClose }: CityInfoProps) => {
  // ...
}
```

## Stores

### Структура store

- Использовать классы для stores
- Приватные методы и свойства помечать `private`
- Публичные методы для изменения состояния
- Использовать `makeAutoObservable` в конструкторе

```typescript
export class MyStore {
  public items: Item[] = []
  private internalState: number = 0
  private animationId: number | null = null

  constructor() {
    makeAutoObservable(this)
  }

  addItem(item: Item) {
    this.items.push(item)
  }

  private startAnimation() {
    // приватный метод
  }
}
```

### Асинхронные операции

- Использовать `runInAction` для синхронных изменений в асинхронных операциях
- Особенно важно в `requestAnimationFrame`, `setTimeout`, `setInterval`

```typescript
private startAnimation() {
  const animate = (timestamp: number) => {
    runInAction(() => {
      // изменения состояния здесь
      this.items.forEach(item => {
        item.progress += delta
      })
    })
    this.animationId = requestAnimationFrame(animate)
  }
  this.animationId = requestAnimationFrame(animate)
}
```

### Доступ к stores

- Избегать прямых мутаций store извне
- Использовать публичные методы store для изменений
- Доступ к `rootStore` через импорт: `import { rootStore } from '../stores'`

## Обработка ошибок

### Проверка данных

- Всегда проверять наличие данных перед использованием
- Использовать опциональную цепочку (`?.`) для безопасного доступа
- Использовать nullish coalescing (`??`) для значений по умолчанию

```typescript
// Хорошо
const cityName = city?.name ?? 'Unknown'
const routeDistance = route?.distance ?? 0

// Плохо
const cityName = city.name // может быть undefined
```

### Условный рендеринг

- Использовать ранний возврат для отсутствующих данных
- Проверять данные перед рендерингом компонентов

```tsx
export const InfoPanel = observer(() => {
  const { selectedEntity } = rootStore.selection

  if (!selectedEntity) return null

  return (
    // рендеринг панели
  )
})
```

## Производительность

### useMemo

- Использовать `useMemo` для дорогих вычислений
- Особенно важно для 3D компонентов (текстуры, геометрия)

```tsx
const texture = useMemo(() => {
  return createGlobeTexture({
    continents: [eurasiaCoordinates],
    waterColor: waterColor,
    continentColor: continentColor,
    width: 2048 * textureQuality,
    height: 1024 * textureQuality,
  })
}, [])
```

### useCallback

- Использовать `useCallback` для функций, передаваемых в дочерние компоненты
- Зависимости должны быть указаны в массиве зависимостей

```tsx
const handleSelect = useCallback((aircraft: Aircraft) => {
  rootStore.selection.selectAircraft(aircraft)
}, [])
```

### Оптимизация 3D компонентов

- Минимизировать пересоздание объектов в каждом рендере
- Использовать `useRef` для ссылок на Three.js объекты
- Группировать связанные объекты в `<group>`

```tsx
export const GlobeCities = observer(() => {
  const { cities } = rootStore.city

  return (
    <group rotation={[GLOBE_ROTATION.X, GLOBE_ROTATION.Y, GLOBE_ROTATION.Z]}>
      {cities.map((city, index) => (
        <City key={index} city={city} />
      ))}
    </group>
  )
})
```

## Комментарии

### Когда комментировать

- Комментировать сложную бизнес-логику
- Объяснять неочевидные решения
- Указывать единицы измерения в вычислениях

```typescript
// Вычисляем пройденное расстояние в км с учётом ускорения времени
const distanceTraveled = (aircraft.speed * deltaTime * TIME_ACCELERATION_FACTOR) / 3600 // км/ч -> км/сек с ускорением
```

### Избегать

- Очевидные комментарии, которые дублируют код
- Закомментированный код (удалять вместо комментирования)


## React Three Fiber

### Работа с 3D компонентами

- 3D компоненты используют `@react-three/fiber` и `@react-three/drei`
- Three.js объекты импортируются как `import * as THREE from 'three'`
- Использовать компоненты из `@react-three/drei` когда возможно (например, `Sphere`, `OrbitControls`)
- Оптимизация 3D компонентов описана в разделе "Производительность"
