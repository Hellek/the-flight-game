/**
 * Утилита для чтения цветов из CSS-переменных
 * Обеспечивает единый источник цветовой схемы для CSS и JavaScript
 */

const defaults: Record<string, string> = {
  '--color-water': '#60a5fa',
  '--color-continent': '#16a34a',
  '--color-item': '#134e4a',
  '--color-aircraft': '#ffffff',
  '--color-item-selected': '#eab308',
  '--color-item-hovered': '#ca8a04',
};

const getCSSVariable = (varName: string): string => {
  if (typeof window === 'undefined') {
    // SSR fallback - возвращаем значения по умолчанию
    return defaults[varName] || '#000000';
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();

  return value || defaults[varName] || '#000000';
};

/**
 * Цветовая схема проекта
 * Цвета читаются из CSS-переменных, определённых в src/index.css через @theme
 * Это обеспечивает единый источник для CSS и JavaScript
 */
export const colors = {
  water: getCSSVariable('--color-water'),
  continent: getCSSVariable('--color-continent'),
  item: getCSSVariable('--color-item'),
  aircraft: getCSSVariable('--color-aircraft'),
  itemSelected: getCSSVariable('--color-item-selected'),
  itemHovered: getCSSVariable('--color-item-hovered'),
} as const;

/**
 * Функция для получения цвета (для динамического чтения при необходимости)
 */
export const getColor = (name: keyof typeof colors): string => {
  return getCSSVariable(`--color-${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
};
