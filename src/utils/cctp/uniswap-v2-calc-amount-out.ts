import { Token, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { Pair, Route, Trade } from '@uniswap/v2-sdk'
import { ethers } from 'ethers'

async function getReserves(tokenA: Token, tokenB: Token, rpcURL: string): Promise<[ethers.BigNumber, ethers.BigNumber]> {
  const provider = new ethers.providers.JsonRpcProvider(rpcURL)
  let pairAddress:string
  try {
    pairAddress = Pair.getAddress(tokenA, tokenB)
    console.log('pairAddress', pairAddress)
  } catch(error) {
    throw new Error(`Pair not found for ${tokenA.symbol} on ${tokenA.chainId} and ${tokenB.symbol} on ${tokenB.chainId}`)
  }
  const pairContract = new ethers.Contract(
    pairAddress,
    ['function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)'],
    provider
  )
  const [reserve0, reserve1] = await pairContract.getReserves()
  return tokenA.sortsBefore(tokenB) ? [reserve0, reserve1] : [reserve1, reserve0]
}

export async function getAmountOut(amountIn: string, tokenIn: Token, tokenOut: Token, rpcURL: string): Promise<string> {
  const [reserveIn, reserveOut] = await getReserves(tokenIn, tokenOut, rpcURL)
  const pair = new Pair(
    CurrencyAmount.fromRawAmount(tokenIn, reserveIn.toString()),
    CurrencyAmount.fromRawAmount(tokenOut, reserveOut.toString())
  )
  const route = new Route([pair], tokenIn, tokenOut)
  const amountInWei = ethers.utils.parseUnits(amountIn, tokenIn.decimals)
  const trade = new Trade(
    route,
    CurrencyAmount.fromRawAmount(tokenIn, amountInWei.toString()),
    TradeType.EXACT_INPUT
  )
  const amountOut = trade.outputAmount.toExact()
  return amountOut
}

/* usage
const CHAIN_ID = 43114;
const TOKEN_IN = new Token(CHAIN_ID, '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', 6, 'USDC')
const TOKEN_OUT = new Token(CHAIN_ID, '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', 6, 'USDt')
const amountIn = '10'
const rpcURL = 'https://api.avax.network/ext/bc/C/rpc'
getAmountOut(amountIn, TOKEN_IN, TOKEN_OUT, rpcURL).then((amountOut) => {
  console.log(`${amountIn} ${TOKEN_IN.symbol} can echange ${amountOut} ${TOKEN_OUT.symbol}`)
}).catch(error => {
  console.error('Error:', error)
})
*/