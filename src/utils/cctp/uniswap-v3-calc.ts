import { CHAINS } from '@/configs/cctp/configs'
import { Token, CurrencyAmount } from '@uniswap/sdk-core'
import { Pool, Route, Trade, FeeAmount, nearestUsableTick, TickMath, TICK_SPACINGS } from '@uniswap/v3-sdk'
import { ethers } from 'ethers'

type FeePool = {
  fee:FeeAmount,
  poolAddress: string
}

export async function getPoolFeeAddrs(tokenA: Token, tokenB: Token, provider: ethers.providers.Provider): 
Promise<FeePool[]> {
  const chain = CHAINS.find(chain => chain.chainId === tokenA.chainId)
  if (!chain) {
    throw new Error(`Chain info not found for ${tokenA.chainId}`)
  }
  console.log('uniswapV3Factory', chain.uniswapV3Factory)
  const factoryContract = new ethers.Contract(
    chain.uniswapV3Factory,
    ['function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'],
    provider
  )

  const feeTiers = [
    FeeAmount.LOWEST, // might get a pool with 0 liquidity
    FeeAmount.LOW,
    FeeAmount.MEDIUM,
    FeeAmount.HIGH
  ]

  let feePools: FeePool[] = []
  for (const fee of feeTiers) {
    try {
      const poolAddress = await factoryContract.getPool(
        tokenA.address, 
        tokenB.address, 
        fee
      )
      console.log('poolAddress', poolAddress)
      if (poolAddress !== ethers.constants.AddressZero) {
        feePools.push({fee, poolAddress})
      }
    } catch (error) {
      console.log('error factoryContract.getPool', {
        'tokenA.address': tokenA.address,
        'tokenB.address': tokenB.address,
        fee
      }, error)
      continue
    }
  }
  console.log('feePools', feePools)
  if (feePools.length>0) return feePools

  throw new Error(`No pool found for token pair ${tokenA.symbol}/${tokenB.symbol} on ${tokenA.chainId}`)
}

export async function getPool(tokenA: Token, tokenB: Token, provider: ethers.providers.Provider): Promise<Pool> {
  const feePools = await getPoolFeeAddrs(tokenA, tokenB, provider)
  console.log('feePools', feePools)

  let _fee = FeeAmount.LOW
  let _sqrtPriceX96 = ethers.BigNumber.from(0)
  let _liquidity = ethers.BigNumber.from(0)
  let _tick = 0

  for (const feePool of feePools) {
    const poolContract = new ethers.Contract(
        feePool.poolAddress,
        [
            'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
            'function liquidity() external view returns (uint128)'
        ],
        provider
    )

    const [slot0, liquidity] = await Promise.all([
        poolContract.slot0(),
        poolContract.liquidity()
    ])

    const [sqrtPriceX96, tick] = [slot0[0], slot0[1]]

    console.log({
      fee: feePool.fee,
      sqrtPriceX96: sqrtPriceX96.toString(),
      liquidity: liquidity.toString(),
      tick
    })

    if (_liquidity.lt(liquidity)) {
        _fee = feePool.fee
        _sqrtPriceX96 = sqrtPriceX96
        _liquidity = liquidity
        _tick = tick
    }
  }

  return new Pool(
      tokenA,
      tokenB,
      _fee,
      _sqrtPriceX96.toString(),
      _liquidity.toString(),
      _tick,
      [
          {
              index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[_fee]),
              liquidityNet: _liquidity.toString(),
              liquidityGross: _liquidity.toString()
          },
          {
              index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[_fee]),
              liquidityNet: _liquidity.mul(-1).toString(),
              liquidityGross: _liquidity.toString()
          }
      ]
  )
}

interface SwapInfo {
  amountOut: string;
  priceRatio: string;
  slippage: number;
  poolDepth: {
    [tokenSymbol: string]: string;
  };
  fee: number
}

interface SwapParams {
  amountIn: string;
  tokenIn: Token;
  tokenOut: Token;
  rpcURL: string;
}

export async function getSwapInfo({
  amountIn,
  tokenIn,
  tokenOut,
  rpcURL
}: SwapParams): Promise<SwapInfo> {
  const provider = new ethers.providers.JsonRpcProvider(rpcURL)
  console.log('rpcURL', rpcURL)
  const pool = await getPool(tokenIn, tokenOut, provider)
  console.log('pool', pool)

  const route = new Route([pool], tokenIn, tokenOut)

  console.log('tokenIn.decimals', tokenIn.decimals)
  const amountInWei = ethers.utils.parseUnits(amountIn, tokenIn.decimals)
  const trade = await Trade.exactIn(
      route,
      CurrencyAmount.fromRawAmount(tokenIn, amountInWei.toString())
  )

  const amountOut = trade.outputAmount.toExact()

  // Calculate price ratio
  const priceRatio = pool.token0.equals(tokenIn) 
      ? pool.token0Price.toSignificant(6) 
      : pool.token1Price.toSignificant(6)

  // Calculate slippage
  const midPrice = route.midPrice
  const executionPrice = trade.executionPrice
  const slippage = parseFloat(midPrice
      .subtract(executionPrice)
      .divide(midPrice)
      .multiply(100)
      .toSignificant(4)) / 100

  // Calculate pool depth
  const sqrtRatioX96 = ethers.BigNumber.from(pool.sqrtRatioX96.toString())
  const liquidity = ethers.BigNumber.from(pool.liquidity.toString())
  console.log('liquidity', liquidity.toString())
  console.log('sqrtRatioX96', sqrtRatioX96.toString())

  const Q96 = ethers.BigNumber.from('2').pow(96)
  console.log('Q96', Q96.toString())
  
  let amount0 = liquidity.mul(Q96).div(sqrtRatioX96)
  let amount1 = liquidity.mul(sqrtRatioX96).div(Q96)

  // Adjust for decimals
  const amount0Readable = ethers.utils.formatUnits(amount0, pool.token0.decimals)
  const amount1Readable = ethers.utils.formatUnits(amount1, pool.token1.decimals)

  return {
      amountOut,
      priceRatio,
      slippage,
      poolDepth: {
        [pool.token0.symbol!]: amount0Readable,
        [pool.token1.symbol!]: amount1Readable
      },
      fee: pool.fee/1000000
  }
}

/* usage
const CHAIN_ID = 1; // Mainnet
const WETH = new Token(CHAIN_ID, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether')
const DAI = new Token(CHAIN_ID, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
const rpcURL = 'https://rpc.ankr.com/eth'
getSwapInfo({amountIn:'1', tokenIn:WETH, tokenOut:DAI, rpcURL}).then((swapInfo) => {
    console.log(`Amount Out: ${swapInfo.amountOut} DAI`)
    console.log(`Price Ratio: 1 WETH = ${swapInfo.priceRatio} DAI`)
    console.log(`Slippage: ${swapInfo.slippage.toFixed(4)}`)
}).catch(error => {
    console.error('Error:', error)
})
*/