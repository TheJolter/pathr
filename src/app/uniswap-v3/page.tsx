'use client'

import { Button } from "@nextui-org/react";
import { getSwapInfo } from "@/utils/cctp/uniswap-v3-calc";
import { Token } from '@uniswap/sdk-core'
import { observer } from 'mobx-react-lite'
import { useStore } from "@/stores/hooks";

export default observer(function UniswapV3() {
  const dialogStore = useStore('dialogStore')
  async function handleCalc() {
    const CHAIN_ID = 42161 // 8453 base, 10 OPTIMISM, 42161 ARBITRUM
    const tokenIn = new Token(CHAIN_ID, '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', 6, 'USDC')
    const tokenOut = new Token(CHAIN_ID, '0xd4d42f0b6def4ce0383636770ef773390d85c61a', 18, 'SUSHI')
    const rpcURL = 'https://arb1.arbitrum.io/rpc'
    const amountIn = '10000'
    getSwapInfo({amountIn, tokenIn, tokenOut, rpcURL}).then((swapInfo) => {
      console.log('swapInfo:', swapInfo)
      alert(JSON.stringify(swapInfo, null, 2))
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
    <div className="text-center mt-40">
      <Button onClick={handleCalc}>calc</Button>
    </div>
  )
})