import { WalletState } from "@web3-onboard/core";
import { action, makeObservable, observable } from "mobx";

export default class EvmWalletStore {
  constructor() {
    makeObservable(this)
  }
  
  @observable
  address: string|null = null

  @action
  login(address: string|null) {
    this.address = address
  }

  @action
  logout() {
    this.address = null
    this.web3OnboardWallets = []
  }

  @observable
  web3OnboardWallets:WalletState[] = []
  @action
  setWeb3OnboardWallets(web3OnboardWallets:WalletState[]) {
    this.web3OnboardWallets = web3OnboardWallets
  }

  @observable
  lastWeb3OnboardDate = 0
  @action
  updateLastWeb3Onboard() {
    this.lastWeb3OnboardDate = new Date().getTime()
  }
}