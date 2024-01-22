import { action, makeObservable, observable } from "mobx";
import { EVM_BLOCKCHAIN_NAME } from "rubic-sdk";

export default class RubicStore {
  constructor() {
    makeObservable(this)
  }

  @observable
  fromChainName: string|null = EVM_BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN
  @action
  setFromChainName(fromChainName: string|null) {
    this.fromChainName = fromChainName
  }

  @observable
  toChainName: string|null = EVM_BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN
  @action
  setToChainName(toChainName: string|null) {
    this.toChainName = toChainName
  }

  @observable
  fromChainTokenAddr: string|null = null
  @action
  setFromChainTokenAddr(fromChainTokenAddr: string|null) {
    this.fromChainTokenAddr = fromChainTokenAddr
  }

  @observable
  toChainTokenAddr: string|null = null
  @action
  setToChainTokenAddr(toChainTokenAddr: string|null) {
    this.toChainTokenAddr = toChainTokenAddr
  }

}