import { action, makeObservable, observable } from "mobx";

type SuccessDialogParams = {
  title: string, 
  tokenAmount: string, 
  tokenUsdValue: string,
  tokenAddr: string,
  // chainId: string,
  detailsUrl: string
}

type WarningDialogParams = {
  title: string,
  content: string
}

export default class DisplayStore {
  constructor() {
    makeObservable(this)
  }

  @observable
  showChainTokenSelector: 'from'|'to'|undefined = undefined // must set a default value
  @action
  setShowChainTokenSelector(showChainTokenSelector: 'from'|'to'|undefined) {
    this.showChainTokenSelector = showChainTokenSelector
  }

  @observable
  selectedProiveder: number = -1
  @action
  setSelectedProvider(selectedProveder: number) {
    console.log({selectedProveder})
    this.selectedProiveder = selectedProveder
  }

  @observable
  showReview = false
  @action
  setShowPreview(showReview: boolean) {
    this.showReview = showReview
  }

  @observable
  successDialogParams: SuccessDialogParams|null = null
  @action
  setSuccessDialogParams(successDialogParams: SuccessDialogParams|null) {
    this.successDialogParams = successDialogParams
  }

  @observable
  warningDialogParams: WarningDialogParams|null = null
  @action
  setWarningDialogParams(warningDialogParams: WarningDialogParams|null) {
    this.warningDialogParams = warningDialogParams
  }

  @observable
  showProviders = false
  @action
  setShowProviders(showProviders: boolean) {
    this.showProviders = showProviders
  }

}