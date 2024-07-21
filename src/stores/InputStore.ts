import { action, makeObservable, observable } from "mobx";

export default class InputStore {
  constructor() {
    makeObservable(this)
  }

  @observable
  tokenAmout: string = ''
  @action
  setTokenAmount(tokenAmout: string) {
    this.tokenAmout = tokenAmout
  }

  @observable
  isAmountInputFocus = false
  @action
  setIsAmountInputFocus(isAmountInputFocus: boolean) {
    this.isAmountInputFocus = isAmountInputFocus
  }

  @observable
  sourceChainID = '0x1'
  @action
  setSourceChainID(sourceChainID: string) {
    this.sourceChainID = sourceChainID
  }

  @observable
  targetChainID = 'joltify_1729-1'
  @action
  setTargetChainID(targetChainID: string) {
    this.targetChainID = targetChainID
  }

  @observable
  targetAddress = ''
  @action
  setTargetAddress(targetAddress: string) {
    this.targetAddress = targetAddress
  }

  @observable
  amount = ''
  @action
  setAmount(amount: string) {
    this.amount = amount
  }
}