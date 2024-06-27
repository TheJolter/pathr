'use client'

import { useStore } from '@/stores/hooks'
import { Button } from '@nextui-org/react'
import { Token, CurrencyAmount, Ether } from '@uniswap/sdk-core'
import { Pair, Route } from '@uniswap/v2-sdk'
import { ethers } from 'ethers'
import { observer } from 'mobx-react-lite'

const CHAIN_ID = 1
const ETH = Ether.onChain(CHAIN_ID)
const WETH = new Token(CHAIN_ID, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether')
const DAI = new Token(CHAIN_ID, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth')

export default observer(function UniswapV2() {

  const dialogStore = useStore('dialogStore')

  async function getReserves(tokenA: Token, tokenB:Token) {
    const pairAddress = Pair.getAddress(tokenA, tokenB)
    const pairContract = new ethers.Contract(
      pairAddress,
      ['function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)'],
      provider
    )
    const [reserve0, reserve1] = await pairContract.getReserves()
    return tokenA.sortsBefore(tokenB) ? [reserve0, reserve1] : [reserve1, reserve0]
  }

  async function getPrice(tokenA:Token, tokenB:Token) {
    const [reserveA, reserveB] = await getReserves(tokenA, tokenB)
    const pair = new Pair(
      CurrencyAmount.fromRawAmount(tokenA, reserveA.toString()),
      CurrencyAmount.fromRawAmount(tokenB, reserveB.toString())
    )
    const route = new Route([pair], tokenA, tokenB)
    return route.midPrice.toSignificant(6)
  }

  function handleCalc() {
    getPrice(WETH, DAI).then(price => {
      console.log(`1 WETH = ${price} DAI`)
      dialogStore.showDialog({
        title: 'Calculation Result',
        content: `1 WETH = ${price} DAI`,
      })
    })
  }

  return (
<div>
  <Button onClick={handleCalc}>calc</Button>
</div>
  )
})