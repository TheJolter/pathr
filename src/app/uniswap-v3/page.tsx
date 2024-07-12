'use client'

import { Button } from "@nextui-org/react";
import { getSwapInfo } from "@/utils/cctp/uniswap-v3-calc";
import { Token } from '@uniswap/sdk-core'
import { observer } from 'mobx-react-lite'
import { useStore } from "@/stores/hooks";

export default observer(function UniswapV3() {
  const dialogStore = useStore('dialogStore')
  async function handleCalc() {
    const CHAIN_ID = 8453 // 8453 base
    const tokenIn = new Token(CHAIN_ID, '0x4200000000000000000000000000000000000006', 8, 'WETH')
    const tokenOut = new Token(CHAIN_ID, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 6, 'USDC')
    const rpcURL = 'https://1rpc.io/base'
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