'use client'

import { CHAINS } from '@/configs/cctp/configs'
import topTokensArbtrum from '@/configs/cctp/uniswap/TopTokens/ARBITRUM.json'
import topTokensBase from '@/configs/cctp/uniswap/TopTokens/BASE.json'
import topTokensAVALANCHE from '@/configs/cctp/uniswap/TopTokens/AVALANCHE.json'
import topTokensOPTIMISM from '@/configs/cctp/uniswap/TopTokens/OPTIMISM.json'
import topTokensPOLYGON from '@/configs/cctp/uniswap/TopTokens/POLYGON.json'
import topTokensETHEREUM from '@/configs/cctp/uniswap/TopTokens/ETHEREUM.json'
import { Button } from '@nextui-org/react'
import { Token } from '@uniswap/sdk-core'
import { EVM_BLOCKCHAIN_NAME } from 'pathr-sdk'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/hooks'
import { getPoolFeeAddrs, getSwapInfo } from '@/utils/cctp/uniswap-v3-calc'
import { ethers } from 'ethers'

export default observer(function UniswapV3USDC() {
  const apiDataStore = useStore('apiDataStore')

  async function handler() {
    const chainName = EVM_BLOCKCHAIN_NAME.ETHEREUM
    const topTokens = topTokensETHEREUM
    
    const chain = CHAINS.find(chain => chain.chainName === chainName)
    if (!chain) {
      console.error(`Chain info not found for ${chainName}`)
      return
    }
    const usdc = topTokens.data.topTokens.find(token => {
      return token.address.toLowerCase() === chain.usdc.toLowerCase()
    })
    if (!usdc) {
      console.log('chain.usdc.toLowerCase()', chain.usdc.toLowerCase())
      console.log('topTokens.data.topTokens', topTokens.data.topTokens)
      console.error(`usdc not found for ${chainName}`)
      return
    }
    const tokenUSDC = new Token(chain.chainId, chain.usdc, usdc.decimals , 'USDC')
    let usdcPools = []
    for (const token of topTokens.data.topTokens) {
      if (token.address.toLowerCase()===chain.usdc) continue
      const token0 = new Token(chain.chainId, token.address, token.decimals, token.symbol)
      try {
        const provider = new ethers.providers.JsonRpcProvider(chain.rpc)
        const swapInfo = await getPoolFeeAddrs(token0, tokenUSDC, provider)
        await new Promise(resolve => setTimeout(resolve, 100))
        usdcPools.push({
          chainID: chain.chainId,
          address: token0.address
        })
      } catch(error) {
        console.error('error getPoolFeeAddr', error)
      }
    }
    console.log('usdcPools', usdcPools)
  }

  return (
<div className='flex justify-center mt-96'>
<Button onClick={handler}>Click</Button>
</div>
  )
})