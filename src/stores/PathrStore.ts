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
  toChainName: string|null = EVM_BLOCKCHAIN_NAME.AVALANCHE
  @action
  setToChainName(toChainName: string|null) {
    this.toChainName = toChainName
  }

  @observable
  fromChainTokenAddr: string|null = '0x912ce59144191c1204e64559fe8253a0e49e6548' // ADDR0
  @action
  setFromChainTokenAddr(fromChainTokenAddr: string|null) {
    this.fromChainTokenAddr = fromChainTokenAddr
  }

  @observable
  toChainTokenAddr: string|null = '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7'
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