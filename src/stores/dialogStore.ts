import { action, makeObservable, observable } from "mobx";

type Dialog = {
  title?: string,
  content: React.ReactNode
}

export default class DialogStore {
  constructor() {
    makeObservable(this)
  }

  @observable
  dialog: Dialog|null = null

  @action
  showDialog(dialog: Dialog) {
    this.dialog = dialog
  }

  @action
  hideDialog() {
    this.dialog = null
  }
}