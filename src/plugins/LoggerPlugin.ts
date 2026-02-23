import { scope } from '@core/di';

@scope.singleton()
export class LoggerPlugin {
  log(level: 'error' | 'warn' | 'info', message: string, payload?: unknown): void {
    const entry = { level, message, ...(payload !== undefined && { payload }) };

    switch (level) {
      case 'error':
        console.error(entry);
        break;
      case 'warn':
        console.warn(entry);
        break;
      default:
        console.info(entry);
    }
  }

  error(message: string, options?: { throw?: boolean; payload?: unknown }): void {
    this.log('error', message, options?.payload);
    if (options?.throw) {
      throw new Error(message);
    }
  }
}
