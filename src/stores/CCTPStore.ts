import { Token } from "@uniswap/sdk-core";
import { action, makeObservable, observable } from "mobx";

type SwapInfo = {
  amountIn: string,
  tokenIn: Token,
  tokenOut: Token,
  amountOut: string,
  fee: number,
  slippage: number,
  targetFee: number
}

export default class CCTPStore {
  constructor() {
    makeObservable(this)
  }

  @observable
  swapInfo: SwapInfo|null = null
  @action
  setSwapInfo(swapInfo: SwapInfo|null) {
    this.swapInfo = swapInfo
  }
}