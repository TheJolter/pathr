import { CoingeckoToken } from "@/utils/get-and-store-coingecko-tokens";
import { action, makeObservable, observable } from "mobx";

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
}