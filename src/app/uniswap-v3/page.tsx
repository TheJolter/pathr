'use client'

import { Button } from "@nextui-org/react";
import { getSwapInfo } from "@/utils/cctp/uniswap-v3-calc";
import { Token } from '@uniswap/sdk-core'
import { observer } from 'mobx-react-lite'
import { useStore } from "@/stores/hooks";

export default observer(function UniswapV3() {
  const dialogStore = useStore('dialogStore')
  async function handleCalc() {
    const CHAIN_ID = 1; // Mainnet
    const tokenIn = new Token(CHAIN_ID, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', 8, 'WBTC')
    const tokenOut = new Token(CHAIN_ID, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6, 'USDC')
    const rpcURL = 'https://rpc.ankr.com/eth'
    const amountIn = '0.01'
    getSwapInfo({amountIn, tokenIn, tokenOut, rpcURL}).then((swapInfo) => {
        dialogStore.showDialog({
          title: 'Uniswap V3',
          content: (<>
            <div>Amount In: {amountIn} {tokenIn.symbol};</div>
            <div>Amount Out: {swapInfo.amountOut} {tokenOut.symbol};</div>
            <div>Price Ratio: 1 {tokenIn.symbol} = {swapInfo.priceRatio} {tokenOut.symbol}; </div>
            <div>Slippage: {swapInfo.slippage.toFixed(4)}</div>
            <div>poolDepth: {JSON.stringify(swapInfo.poolDepth)}</div>
          </>),
        })
    }).catch(error => {
        console.error('Error:', error)
    })
  }
  return (
    <div>
      <Button onClick={handleCalc}>calc</Button>
    </div>
  )
})