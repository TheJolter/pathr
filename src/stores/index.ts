import React from "react";
import { InputStore } from "./InputStore"

export const stores = Object.freeze({
  inputStore: new InputStore()
})

export const storesContext = React.createContext(stores);
export const StoresProvider = storesContext.Provider;