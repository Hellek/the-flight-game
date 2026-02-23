# Стандарты написания кода

## TypeScript типизация

### Общие правила

- Все компоненты должны иметь явную типизацию props через интерфейсы
- Избегать `any` - использовать `unknown` если тип неизвестен
- Использовать union types для ограниченных наборов значений

## Именование

### Типы и интерфейсы

- Использовать PascalCase для типов, интерфейсов и enum
- Примеры: `Aircraft`, `Route`, `AircraftSize`

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
- Во вьюшке виджета получать модель через хук с деструктуризацией: `const { cities, selectCity, selectedCity } = useCitiesModel()`, а не `const model = useCitiesModel()` и далее `model.cities`
- В ViewModel методы, которые передаются во вьюшку (колбэки), объявлять стрелочными функциями поля класса (`method = (): void => { ... }`), чтобы не терять контекст `this`

```tsx
import { observer } from 'mobx-react-lite'

export const InfoPanel = observer(function InfoPanel() {
  const { selectedEntity } = useInfoPanelModel() // или другой хук модели виджета
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

## Stores и сервисы с реактивным состоянием

В проекте реактивное состояние (MobX) используется в **сервисах** (`services/`) и во **ViewModel виджетов** (`widgets/*/model/`). Единого RootStore нет; доступ к данным — через DI и хуки `useXxxModel()`.

### Структура (классы с makeAutoObservable)

- Использовать классы для сервисов и моделей с состоянием
- Приватные методы и свойства помечать `private`
- Публичные методы для изменения состояния
- Использовать `makeAutoObservable` в конструкторе

```typescript
export class CityService {
  public cities: City[] = []
  private animationId: number | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setCities(cities: City[]) {
    this.cities = cities
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
      this.items.forEach(item => {
        item.progress += delta
      })
    })
    this.animationId = requestAnimationFrame(animate)
  }
  this.animationId = requestAnimationFrame(animate)
}
```

### Доступ к состоянию

- В виджетах — через хуки моделей: `const { cities, selectCity } = useCitiesModel()` (см. раздел MobX компоненты).
- Сервисы инжектируются во ViewModel и в другие сервисы через DI; не импортировать сервисы напрямую из компонентов.

## DI (Dependency Injection)

### Типизация входящих props в ViewModel

Если виджет получает данные от родителя через props (например, `cities`, `routes`), модель должна:

1. Объявить интерфейс пропсов (например, `CitiesModelProps`).
2. Инжектировать в конструктор типизированный `Props<YourModelProps>` первым аргументом — провайдер при резолве вызовет на нём `set(restProps)`, в модели доступен типобезопасный `this.props.current`.
3. Оставить `[init](props: YourModelProps)` для первичной инициализации; при необходимости читать актуальные пропсы через `this.props.current` и реализовать `updateProps(props)` при смене пропсов.

```typescript
import { init, Props, scope } from '@core/di';

export interface CitiesModelProps {
  cities: Cities;
}

@scope.transient()
export class CitiesModel {
  constructor(
    public readonly props: Props<CitiesModelProps>,
    private readonly cityService: CityService,
    private readonly selectionService: SelectionService,
  ) {}

  [init](props: CitiesModelProps): void {
    this.cityService.initialSet(props.cities);
  }

  // при необходимости — доступ к актуальным пропсам
  get cities(): City[] {
    return this.cityService.cities;
  }
}
```

Модели без входящих пропсов (виджет не принимает props) не инжектируют `Props`.

### Импорты для инжектируемых зависимостей

- В конструкторе классов, резолвящихся из контейнера (ViewModel, сервисы с зависимостями), **не использовать `import type`** для параметров конструктора.
- Типы, импортированные через `import type`, стираются при компиляции; контейнер (Tsyringe) не видит тип на позиции и выдаёт ошибку вида «TypeInfo not known for "Object"».
- Использовать **обычный импорт** класса: тогда тип доступен и в TypeScript, и в рантайме для разрешения зависимости.

```typescript
import { scope } from '@core/di';
// ✅ Правильно: import сервисов без type  — контейнер видит класс и может инжектить
import { FinanceService, SelectionService } from '@services';

@scope.transient()
export class HeaderModel {
  constructor(
    public readonly finance: FinanceService,
    public readonly selection: SelectionService,
  ) {}
}
```

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
export const InfoPanelView = observer(() => {
  const { selectedEntity } = useSelectionModel() // или хук модели виджета с выбором

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
  selectionService.selectAircraft(aircraft) // сервис из useXxxModel() или инжект
}, [])
```

### Оптимизация 3D компонентов

- Минимизировать пересоздание объектов в каждом рендере
- Использовать `useRef` для ссылок на Three.js объекты
- Группировать связанные объекты в `<group>`

```tsx
export const GlobeCities = observer(() => {
  const { cities, globeInitialRotation } = useCitiesModel()

  return (
    <group rotation={globeInitialRotation}>
      {cities.map((city, index) => (
        <City key={index} city={city} />
      ))}
    </group>
  )
})
```

### Избегать

- Очевидные комментарии, которые дублируют код
- Закомментированный код (удалять вместо комментирования)


## React Three Fiber

### Работа с 3D компонентами

- 3D компоненты используют `@react-three/fiber` и `@react-three/drei`
- Three.js объекты импортируются как `import { Vector3 } from 'three'`
- Использовать компоненты из `@react-three/drei` когда возможно (например, `Sphere`, `OrbitControls`)
- Оптимизация 3D компонентов описана в разделе "Производительность"
