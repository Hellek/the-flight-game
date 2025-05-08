import { makeAutoObservable } from 'mobx'

export class FinanceStore {
  balance: number = 10000

  constructor() {
    makeAutoObservable(this)
  }

  topUpBalance(amount: number) {
    this.balance += amount
  }

  subtractBalance(amount: number) {
    this.balance -= amount
  }

  get formattedBalance(): string {
    return `${this.balance}₽`
  }
}
