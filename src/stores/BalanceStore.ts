import BigNumber from "bignumber.js"
import { action, makeObservable, observable } from "mobx"

export type Balances = Record<
  string, // eg: 'chainId(hex)-contract-account' // all in lower case
  {
    amount: BigNumber, // eg: 0.123456
    decimals: number
  }
>

export class BalanceStore {
  constructor() {
    makeObservable(this)
  }

  @observable
  balances: Balances = {}
  @action
  addBalance(balance: Balances) {
    this.balances = {...this.balances, ...balance}
  }

  @observable
  fetchings: string[] = [] // chainName-account
  @action
  addFetching(fetching: string) {
    if (!this.fetchings.includes(fetching)) {
      this.fetchings.push(fetching)
    }
  }

  @observable
  fetchedAddresses: string[] = [] // only address
  @action
  addFetchedAddress(fetchedAddress: string) {
    if (!this.fetchedAddresses.includes(fetchedAddress)) {
      this.fetchedAddresses.push(fetchedAddress)
    }
  }
}