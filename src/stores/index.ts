import React from "react";
import InputStore from "./InputStore"
import DisplayStore from "./displayStore";
import EvmWalletStore from "./EvmWalletStore";
import RubicStore from "./rubicStore";


export const stores = Object.freeze({
  inputStore: new InputStore(),
  displayStore: new DisplayStore(),
  evmWalletStore: new EvmWalletStore(),
  rubicStore: new RubicStore()
})

export const storesContext = React.createContext(stores);
export const StoresProvider = storesContext.Provider;