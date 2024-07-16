import { action, makeObservable, observable } from "mobx";

export default class CosmosWalletStore {
  constructor() {
    makeObservable(this)
  }

  @observable
  address: string|null = null;

  @observable
  isNanoLedger = false

  @action
  login(address: string, moreParams: {
    isNanoLedger: boolean
  } = {
    isNanoLedger: false
  }) {
    this.address = address
    this.isNanoLedger = moreParams.isNanoLedger
  }

  @action
  logout() {
    this.address = null
    this.isNanoLedger = false
  }
}