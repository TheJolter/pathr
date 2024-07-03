import { Token } from "@uniswap/sdk-core";
import { isUsdc } from "./isUsdc";
// import { getAmountOut } from "./uniswap-v2-calc-amount-out";
import { CHAINS } from "@/configs/cctp/configs";
import ApiDataStore from "@/stores/ApiDataStore";
import { getSwapInfo } from "./uniswap-v3-calc";

// source token is USDC, target token is not USDC: only calc on target chain, usdc -> tokenOut
// source and target token is not USDC: calc: in source chian, tokenIn -> usdc, in target chain, usdc -> tokenOut
// source and target token is USDC: amount out equals amount in
// source is not USDC, target is USDC: calc: in source chain, tokenIn -> usdc

export default function calcRouter({
  amountIn,
  tokenIn,
  tokenOut,
  apiDataStore
}:{
  amountIn: string,
  tokenIn: Token,
  tokenOut: Token,
  apiDataStore: ApiDataStore
}): Promise<{
  amountOut: string,
  fee: number,
  slippage: number
}> {
  return new Promise((resolve, reject)=>{
    if (isUsdc(tokenIn) && isUsdc(tokenOut)) {
      resolve({
        amountOut: amountIn,
        fee: 0,
        slippage: 0
      })
      return
    }
    const chainOut = CHAINS.find(chain=>chain.chainId===tokenOut.chainId)
    if (!chainOut) {
      reject('chainOut info not found')
      return
    }
    const usdcTo = apiDataStore.coingeckoTokens.find(token=>token.address.toLowerCase()===chainOut.usdc.toLowerCase())
    if (!usdcTo) {
      reject(`There is no USDC on chain ${tokenOut.chainId}`)
      return
    }
    const USDCTokenTarget = new Token(usdcTo.chainId, usdcTo.address, usdcTo.decimals, usdcTo.symbol, usdcTo.name)
    
    if (isUsdc(tokenIn) && !isUsdc(tokenOut)) {
      // only calc on target chain, usdc -> tokenOut
      console.log({amountIn, USDCTokenTarget, tokenOut, rpc: chainOut.rpc})
      getSwapInfo({amountIn, tokenIn: USDCTokenTarget, tokenOut, rpcURL: chainOut.rpc}).then(swapInfo=>{
        resolve({
          amountOut: swapInfo.amountOut,
          fee: swapInfo.fee,
          slippage: swapInfo.slippage
        })
      }).catch(error=>{
        reject(error)
      })
      return
    }
    const chainIn = CHAINS.find(chain=>chain.chainId===tokenIn.chainId)
    if (!chainIn) {
      reject('chainIn info not found')
      return
    }

    const usdcFrom = apiDataStore.coingeckoTokens.find(token=>token.address.toLowerCase()===chainIn.usdc.toLowerCase())
    if (!usdcFrom) {
      reject(`There is no USDC on chain ${tokenIn.chainId}`)
      return
    }
    if (!isUsdc(tokenIn) && isUsdc(tokenOut)) {
      // calc: in source chain, tokenIn -> usdc
      const USDCTokenSource = new Token(tokenIn.chainId, usdcFrom.address, usdcFrom.decimals, usdcFrom.symbol)
      getSwapInfo({amountIn, tokenIn, tokenOut: USDCTokenSource, rpcURL: chainIn.rpc}).then(swapInfo=>{
        resolve({
          amountOut: swapInfo.amountOut,
          fee: swapInfo.fee,
          slippage: swapInfo.slippage
        })
      }).catch(error=>{
        reject(error)
      })
      return
    }

    // source and target token is not USDC: calc: in source chian, tokenIn -> usdc, in target chain, usdc -> tokenOut
    const USDCTokenSource = new Token(usdcFrom.chainId, usdcFrom.address, usdcFrom.decimals, usdcFrom.symbol, usdcFrom.name)
    getSwapInfo({amountIn, tokenIn, tokenOut: USDCTokenSource, rpcURL: chainIn.rpc}).then(swapInfo=>{
      const fee1 = swapInfo.fee
      const slippage1 = swapInfo.slippage
      getSwapInfo({amountIn: swapInfo.amountOut, tokenIn: USDCTokenTarget, tokenOut, rpcURL: chainOut.rpc}).then(swapInfo=>{
        resolve({
          amountOut: swapInfo.amountOut,
          fee: fee1 + swapInfo.fee,
          slippage: slippage1 + swapInfo.slippage
        })
      }).catch(error=>{
        reject(error)
      })
    }).catch(error=>{
      reject(error)
    })
  })
}