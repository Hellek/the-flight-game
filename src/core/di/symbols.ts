/** Токен метода инициализации модели (вызывается только провайдером, не извне). */
export const init = Symbol('init');
/** Токен метода обновления пропсов модели. */
export const update = Symbol('update');
/** Токен метода уничтожения модели. */
export const destroy = Symbol('destroy');

/** Scope класса (записывается декоратором scope). */
export const constructorScope = Symbol('constructorScope');

/** Признак класса Props (для поиска в аргументах конструктора при resolveWithTransforms). */
export const propsAttribute = Symbol('propsAttribute');
