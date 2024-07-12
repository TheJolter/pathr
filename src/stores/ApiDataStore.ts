import { CoingeckoToken } from "@/utils/get-and-store-coingecko-tokens";
import { action, makeObservable, observable } from "mobx";

export type PlatformFee = {chainID: number, feeUSDC: string}

export default class ApiDataStore {
  constructor() {
    makeObservable(this)
  }

  @observable
  coingeckoTokens: CoingeckoToken[] = []
  @action
  setCoingeckoTokens(coingeckoTokens: CoingeckoToken[]) {
    this.coingeckoTokens = coingeckoTokens
  }

  // fee for pathr cctp contract
  @observable
  platformFees: PlatformFee[] = [] // { [key: string]: string } = {}
  @action
  addPlatformFee(chainID: number, feeUSDC: string) {
    this.platformFees.push({chainID, feeUSDC})
  }
}