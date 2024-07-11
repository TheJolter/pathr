import { ADDR0 } from "@/configs/pathr/tokens";
import { action, makeObservable, observable } from "mobx";
import { EVM_BLOCKCHAIN_NAME, OnChainTrade, OnChainTradeError, WrappedCrossChainTrade } from "pathr-sdk";

export default class PathrStore {
  constructor() {
    makeObservable(this)
  }

  @observable
  fromChainName: string|null = EVM_BLOCKCHAIN_NAME.ARBITRUM
  @action
  setFromChainName(fromChainName: string|null) {
    this.fromChainName = fromChainName
  }

  @observable
  toChainName: string|null = EVM_BLOCKCHAIN_NAME.BASE
  @action
  setToChainName(toChainName: string|null) {
    this.toChainName = toChainName
  }

  @observable
  fromChainTokenAddr: string|null = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'.toLowerCase() // ADDR0
  @action
  setFromChainTokenAddr(fromChainTokenAddr: string|null) {
    this.fromChainTokenAddr = fromChainTokenAddr
  }

  @observable
  toChainTokenAddr: string|null = '0x4200000000000000000000000000000000000006'
  @action
  setToChainTokenAddr(toChainTokenAddr: string|null) {
    this.toChainTokenAddr = toChainTokenAddr
  }

  @observable
  routerCalcTime = new Date()
  @action
  updateRouterCalcTime() {
    this.routerCalcTime = new Date()
  }

  @observable
  trades: Array<OnChainTrade | OnChainTradeError | WrappedCrossChainTrade> = []
  @action
  setTrades(
    trades: Array<OnChainTrade | OnChainTradeError | WrappedCrossChainTrade>
  ) {
    this.trades = trades
  }

  @observable
  calculating:boolean = false
  @action
  setCalculating(calculating: boolean) {
    this.calculating = calculating
  }
}