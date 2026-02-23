import { describe, expect, it } from 'vitest';
import { FinanceService } from '../FinanceService';

describe('FinanceService', () => {
  it('инициализируется с балансом 10000', () => {
    const service = new FinanceService();
    expect(service.balance).toBe(10000);
  });

  it('topUpBalance увеличивает баланс', () => {
    const service = new FinanceService();
    service.topUpBalance(5000);
    expect(service.balance).toBe(15000);
    service.topUpBalance(1000);
    expect(service.balance).toBe(16000);
  });

  it('subtractBalance уменьшает баланс', () => {
    const service = new FinanceService();
    service.subtractBalance(3000);
    expect(service.balance).toBe(7000);
    service.subtractBalance(2000);
    expect(service.balance).toBe(5000);
  });

  it('formattedBalance возвращает строку с рублем', () => {
    const service = new FinanceService();
    expect(service.formattedBalance).toBe('10000₽');
    service.topUpBalance(500);
    expect(service.formattedBalance).toBe('10500₽');
  });
});
