import { action, makeObservable, observable } from "mobx";

export class InputStore {
  constructor() {
    makeObservable(this)
  }

  @observable
  tokenAmout: string = ''
  @action
  setTokenAmount(tokenAmout: string) {
    this.tokenAmout = tokenAmout
  }
}