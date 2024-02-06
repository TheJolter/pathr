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
}