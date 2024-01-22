import { action, makeObservable, observable } from "mobx";

export default class EvmWalletStore {
  constructor() {
    makeObservable(this)
  }
  @observable
  address: string|null = null

  @action
  login(address: string) {
    this.address = address
  }

  @action
  logout() {
    this.address = null
  }
}