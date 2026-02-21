# Архитектурные правила

**Слои:** View Layer (виджеты, компоненты, ViewModel) — только UI-состояние и вызов сервисов. Domain Layer — бизнес-логика в сервисах (Service). ViewModel и компоненты получают модель через `useModel()`, подписка на изменения — через MobX (`observer`, `makeAutoObservable`). DI-контейнер — Tsyringe, слой провайдеров в `src/core/di/`.

### Общие принципы
1. Зона ответственности сущности должна быть ограничена её слоем — View Layer сущности не должны содержать Domain Layer логику
2. Сущности вышележащих уровней используют сущности нижележащих — ViewModel использует Service и Plugin, Service использует Plugin
3. Универсальность сущностей должна расти сверху вниз — ViewModel менее универсальные, Plugin максимально универсальные

### View Layer
4. Запрещено использовать родительские или дочерние ViewModel внутри Widget — внутри виджета может использоваться только его собственная ViewModel
5. Widget не должен зависеть от окружения — виджет обязан иметь возможность встраиваться в любое место без дополнительных обвязок (контекст React, специально подготовленные сервисы)
6. Component не должен содержать бизнес-логику
7. ViewModel не должна содержать бизнес-логику — ViewModel может хранить только данные, влияющие на UI (состояния чекбоксов, инпутов), но не бизнес-логику. Бизнес логика описывается в Domain Layer
8. ViewModel может содержать подмодели — VM могут содержать в себе другие SubViewModel
9. Component может обращаться только к своему ViewModel (через хук вида `useXxxModel()` от провайдера виджета; реактивность — MobX `observer`). Во вьюшке использовать деструктуризацию результата хука:

```ts
const { cities, selectCity, selectedCity } = useCitiesModel()
```

10. Методы ViewModel, передаваемые во вьюшку (в т.ч. при деструктуризации), должны быть объявлены как стрелочные функции поля класса (`method = (): void => { ... }`), чтобы не терять контекст `this` при вызове из компонентов. Пример:

```ts
selectCity = (city: City | null): void => {
  this.cityService.selectCity(city)
}
```

### Domain Layer
Domain Layer — слой бизнес-логики; в нём сервисы (переиспользуемая логика, не привязанная к UI).
11. Service должен иметь четко определенную ответственность — сервис должен инкапсулировать переиспользуемый функционал
12. Service может подключать другие сервисы только через DI — прямые импорты сервисов запрещены
13. Service может подключать плагины только через DI — прямые импорты плагинов запрещены

### Platform Layer (опционально)
14. Plugin должен иметь абстрактный интерфейс — для защиты от изменения реализации. Используется, если есть подменяемые реализации (API, навигация и т.п.).

### DI Container
Контейнер — Tsyringe; провайдеры и виджеты реализованы в `src/core/di/` (DIProvider, ChildDIProvider, createProvider, createWidget). Scope маппятся на Lifecycle Tsyringe (Transient, Singleton, ContainerScoped).

**Импорты из core/di:** всегда импортировать из barrel `@core/di`, не из вложенных модулей:

```ts
// Правильно
import { scope, createProvider, createWidget } from '@core/di'

// Неправильно
import { scope } from '@core/di/scopeDecorators'
import { createProvider } from '@core/di/createProvider'
```

**Стиль экспорта провайдера модели виджета:** в `model/index.ts` результат `createProvider(SomeModel)` экспортировать одной строкой через `export const`, без промежуточной переменной и без отдельного `export { ... }`:

```ts
import { createProvider } from '@core/di'
import { GameModel } from './GameModel'

export const { Provider: GameModelProvider, useModel: useGameModel } = createProvider(GameModel);
```

Модель виджета с декоратором scope:

```ts
import { scope } from '@core/di'
// ...
@scope.transient()
export class GameModel {
```

**Типизация входящих props в ViewModel:** если виджет получает от родителя props (например, `cities`, `routes`), в конструктор модели первым аргументом инжектировать `Props<YourModelProps>` из `@core/di`. Провайдер при резолве вызовет на нём `set(restProps)`; в модели доступен типобезопасный `this.props.current`. Интерфейс пропсов объявлять в том же файле (например, `CitiesModelProps`). Метод `[init](props)` оставить для первичной инициализации.

```ts
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
}
```
14. Страница всегда должна создавать свой собственный DI контейнер — PageDIContainer создается для каждого роута
15. Widget может создавать свой DI контейнер — ChildDIContainer для виджета или группы виджетов
16. В каждом DI контейнере создаются свои экземпляры сервисов — сервисы не шарятся между контейнерами, если они не глобальные
17. Время жизни VM и не глобальных сервисов ограничено маунтом/размаунтом контейнера — при размонтировании контейнера все сущности должны быть очищены

### Нейминг
18. Название класса должно содержать префикс домена/страницы — например: DocsFilters, DocsList
19. Название полей внутри класса не должно содержать префикс — у модели DocsPage поля именуются без префикса (filters, а не docsPageFilters)
20. Service должен иметь постфикс "Service" — например: DocsService
21. ViewModel должен иметь постфикс "Model" — например: DocsModel, DocsUploadModalModel
22. Widget должен иметь постфикс "Widget" — например: DocsUploadModalWidget
23. Page должен иметь постфикс "Page" — например: DocsPage
24. Название ViewModel должно перекликаться с названием Widget — например: MusicCellWidget → MusicCellModel


