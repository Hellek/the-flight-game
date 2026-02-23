import { makeAutoObservable } from 'mobx';
import { scope } from '@core/di';

@scope.singleton()
export class FinanceService {
  balance: number = 10000;

  constructor() {
    makeAutoObservable(this);
  }

  topUpBalance(amount: number) {
    this.balance += amount;
  }

  subtractBalance(amount: number) {
    this.balance -= amount;
  }

  get formattedBalance(): string {
    return `${this.balance}₽`;
  }
}
