import { ADDR0 } from "@/configs/rubic/tokens";
import { action, makeObservable, observable } from "mobx";
import { CrossChainTrade, EVM_BLOCKCHAIN_NAME, OnChainTrade, OnChainTradeError, WrappedCrossChainTrade } from "rubic-sdk";

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
  fromChainTokenAddr: string|null = ADDR0
  @action
  setFromChainTokenAddr(fromChainTokenAddr: string|null) {
    this.fromChainTokenAddr = fromChainTokenAddr
  }

  @observable
  toChainTokenAddr: string|null = '0x7db21353a0c4659b6a9a0519066aa8d52639dfa5'
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