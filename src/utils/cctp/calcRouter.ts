import { Token } from "@uniswap/sdk-core";
import { isUsdc } from "./isUsdc";
// import { getAmountOut } from "./uniswap-v2-calc-amount-out";
import { CHAINS } from "@/configs/cctp/configs";
import ApiDataStore from "@/stores/ApiDataStore";
import { getSwapInfo } from "./uniswap-v3-calc";
import bn from "../bn";

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
  fee: number, // fee in source chain
  slippage: number,
  targetFee: number,
  timeUsed: string,
  timeSecond: number
}> {
  const feeUSDC = apiDataStore.platformFees.find(fee=>fee.chainID===tokenOut.chainId)?.feeUSDC || '0'
  return new Promise((resolve, reject)=>{

    const chainIn = CHAINS.find(chain=>chain.chainId===tokenIn.chainId)
    if (!chainIn) {
      reject('chainIn info not found')
      return
    }
    if (!chainIn.bridgeAddress) {
      reject(`bridge contract can not found on chain ${tokenIn.chainId}`)
      return
    }

    const chainOut = CHAINS.find(chain=>chain.chainId===tokenOut.chainId)
    if (!chainOut) {
      reject('chainOut info not found')
      return
    }

    const timeSecond = chainIn.timeSecond
    let timeUsed = chainIn.timeSecond + 's'
    if (chainIn.timeSecond > 60) {
      timeUsed = Math.floor(chainIn.timeSecond / 60) + 'm'
    }

    if (isUsdc(tokenIn) && isUsdc(tokenOut)) {
      let _amountOut = bn(amountIn).minus(feeUSDC)
      if (_amountOut.lt(0)) {
        _amountOut = bn(0)
      }
      resolve({
        amountOut: _amountOut.toFixed(),
        fee: 0,
        slippage: 0, // _amountOut.minus(amountIn).div(amountIn).toNumber(),
        targetFee: 0,
        timeSecond,
        timeUsed
      })
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
      let _tokenIn = bn(amountIn).minus(feeUSDC)
      if (_tokenIn.lt(0)) {
        _tokenIn = bn(0)
      }
      getSwapInfo({
        amountIn: _tokenIn.toFixed(),
        tokenIn: USDCTokenTarget, tokenOut, rpcURL: chainOut.rpc
      }).then(swapInfo=>{
        resolve({
          amountOut: swapInfo.amountOut,
          fee: 0, // only swap in target chain, no fee in source chain
          slippage: swapInfo.slippage,
          targetFee: swapInfo.fee,
          timeSecond,
          timeUsed
        })
      }).catch(error=>{
        reject(error)
      })
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
        let _amountOut = bn(swapInfo.amountOut).minus(feeUSDC)
        if (_amountOut.lt(0)) {
          _amountOut = bn(0)
        }
        resolve({
          amountOut: _amountOut.toFixed(),
          fee: swapInfo.fee,
          slippage: swapInfo.slippage,
          targetFee: 0, // only swap in source chain, no fee in target chain
          timeSecond,
          timeUsed
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
      console.log({
        'swapInfo.amountOut': swapInfo.amountOut,
        feeUSDC
      })
      let _tokenIn = bn(swapInfo.amountOut).minus(feeUSDC)
      if (_tokenIn.lt(0)) {
        _tokenIn = bn(0)
      }
      getSwapInfo({amountIn: _tokenIn.toFixed(), tokenIn: USDCTokenTarget, tokenOut, rpcURL: chainOut.rpc}).then(swapInfo=>{
        resolve({
          amountOut: swapInfo.amountOut,
          fee: fee1,
          slippage: slippage1 + swapInfo.slippage,
          targetFee: swapInfo.fee,
          timeSecond,
          timeUsed
        })
      }).catch(error=>{
        reject(error)
      })
    }).catch(error=>{
      reject(error)
    })
  })
}