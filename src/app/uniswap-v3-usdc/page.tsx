'use client'

import { CHAINS } from '@/configs/cctp/configs'
import topTokensArbtrum from '@/configs/cctp/uniswap/TopTokens/ARBITRUM.json'
import topTokensBase from '@/configs/cctp/uniswap/TopTokens/BASE.json'
import { Button } from '@nextui-org/react'
import { Token } from '@uniswap/sdk-core'
import { EVM_BLOCKCHAIN_NAME } from 'pathr-sdk'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/hooks'
import { getSwapInfo } from '@/utils/cctp/uniswap-v3-calc'

export default observer(function UniswapV3USDC() {
  const apiDataStore = useStore('apiDataStore')

  async function handler() {
    const chain = CHAINS.find(chain => chain.chainName === EVM_BLOCKCHAIN_NAME.BASE)
    if (!chain) return
    const usdc = apiDataStore.coingeckoTokens.find(token => {
      token.address.toLowerCase() === chain.usdc.toLowerCase()
      && token.chainId === chain.chainId
    })
    if (!usdc) return
    const tokenUSDC = new Token(chain.chainId, chain.usdc, usdc.decimals , 'USDC')
    let usdcPools = []
    for (const token of topTokensBase.data.topTokens) {
      if (token.address.toLowerCase()===chain.usdc) continue
      const token0 = new Token(chain.chainId, token.address, token.decimals, token.symbol)
      try {
        const swapInfo = await getSwapInfo({amountIn: '1', tokenIn: token0, tokenOut: tokenUSDC, rpcURL: chain.rpc})
      } catch(error) {

      }
    }
  }

  return (
<div className='flex justify-center mt-96'>
<Button onClick={handler}>Click</Button>
</div>
  )
})