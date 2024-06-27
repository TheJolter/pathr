import React from "react";
import InputStore from "./InputStore"
import DisplayStore from "./displayStore";
import EvmWalletStore from "./EvmWalletStore";
import PathrStore from "./PathrStore";
import { BalanceStore } from "./BalanceStore";
import DialogStore from "./dialogStore";
import ApiDataStore from "./ApiDataStore";


export const stores = Object.freeze({
  inputStore: new InputStore(),
  displayStore: new DisplayStore(),
  evmWalletStore: new EvmWalletStore(),
  pathrStore: new PathrStore(),
  balanceStore: new BalanceStore(),
  dialogStore: new DialogStore(),
  apiDataStore: new ApiDataStore()
})

export const storesContext = React.createContext(stores);
export const StoresProvider = storesContext.Provider;