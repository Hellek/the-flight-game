# Структура директорий SPA

## Корневая структура

```
src/
├── components/     dummy компоненты
├── core/           Ядро приложения
│   └── di/         DI-библиотека - контейнеры, провайдеры, createWidget
├── pages/          Страницы приложения
├── plugins/        Плагины (инфраструктура): логгер, настройки, выделение и т.д.
├── services/       Продуктовые сервисы (доменная логика): маршруты, самолёты, города, финансы
├── utils/          Переиспользуемые утилиты
├── widgets/        виджеты
├── App.tsx
├── main.tsx
└── index.css
```

**Распределение кода:**
- **models** — внутри виджетов (`widgets/*/model/`); доступ через `useXxxModel()`.
- **services** — доменная логика (RouteService, AircraftService, CityService, FinanceService); не инжектируют друг друга.
- **plugins** — инфраструктура (LoggerPlugin, GameSettingsPlugin и т.д.); от них зависят сервисы и ViewModel. Импорт — `@plugins`. Классы плагинов имеют суффикс "Plugin".

---

## UI-компоненты

Переиспользуемые UI-компоненты (дизайн-система shadcn/ui) — в `src/components/ui/`. Документация по созданию и правилам: **docs/ui-components.md**. Инструкции для ИИ-агента: **.cursor/rules/ui-components.md**.

---

## Алиасы
ВСЕГДА используй алиасы вместо прямого пути. Соответствуют `tsconfig.json` (paths).

## Виджеты и страницы

### widgets

Фиксированная директория для виджетов.

**Правило:** Виджеты не могут содержать подвиджеты, но могут использовать рядом лежащие.

```
widgets/
├── WidgetGamma/
│   ├── WidgetGamma.tsx/         Содержит WidgetGammaView-компонент и createWidget(WidgetGammaModelProvider, WidgetGammaView);
│   ├── components/          Содержит dummy подкомпоненты WidgetGammaView
│   └── model/
│       ├── index.ts         экспорт WidgetGammaModelProvider и useWidgetGammaModel создаваемые через createProvider
│       └── WidgetGammaModel     ViewModel виджета WidgetGamma
├── WidgetBeta/
│   ├── WidgetBeta.tsx/         Содержит WidgetBetaView-компонент и createWidget(WidgetBetaModelProvider, WidgetBetaView);
│   ├── components/          Содержит dummy подкомпоненты WidgetBetaView
│   └── model/
│       ├── index.ts         экспорт WidgetBetaModelProvider и useWidgetBetaModel создаваемые через createProvider
│       └── WidgetBetaModel     ViewModel виджета WidgetBeta
```

### pages (в данном проекте)

Страницы лежат в `pages/` (например `GamePage.tsx`, `AircraftsPage.tsx`), подключаются в `App.tsx` через react-router-dom. Модели страниц и сложная разбивка по роутам не используются.

**Правило для components:** Простые компоненты, которые используют модель страницы и не могут работать без вставки в компонент страницы.

**Правило использования:** Компоненты из этой директории могут использовать только на этом уровне вложенности и ниже.

---

## Общие правила

1. **У каждой директории могут быть свои utils** — вспомогательные функции могут находиться на любом уровне вложенности.

2. **Виджеты не могут содержать в своей директории другие виджеты**, но могут использовать рядом лежащие.

3. **Простые компоненты можно дробить на другие более мелкие компоненты** — компоненты могут содержать вложенные директории `components`.

4. **Компоненты из директории components могут использовать только на этом уровне вложенности и ниже** — ограничение на использование компонентов.
