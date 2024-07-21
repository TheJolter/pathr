import { action, makeObservable, observable } from "mobx";
import * as React from "react";

type ModalInfo = {
  title?: string,
  body: React.ReactNode
}

export default class ModalStore {
  constructor() {
    makeObservable(this)
  }

  @observable
  modalInfo: ModalInfo|null = null

  @action
  showModal(modalInfo:ModalInfo) {
    this.modalInfo = modalInfo
  }

  @action
  closeModal() {
    this.modalInfo = null
  }
}