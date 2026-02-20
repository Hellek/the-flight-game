import { makeAutoObservable } from 'mobx'

export class FinanceModel {
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
