import { EVM_BLOCKCHAIN_NAME } from "pathr-sdk"

// all coingeckoApiId: https://api.coingecko.com/api/v3/asset_platforms

type Chain = {
  chainName: string,
  chainId: number,
  coingeckoApiId?: string, // https://tokens.coingecko.com/arbitrum-one/all.json
  logoURI: string,
  canBeSource: boolean,
  domain: number,
  usdc: string,
  rpc: string,
  bridgeAddress?: string, // pathrOut, if not set, don't show in source chain selection list
  explorer: string,
  receiverContract?: string, // pathrIn, if not set, don't show in target chain selection list
  uniswapV3Factory: string, // https://docs.uniswap.org/contracts/v3/reference/deployments/base-deployments
  timeSecond: number, // https://developers.circle.com/stablecoins/docs/required-block-confirmations
}
export const CHAINS:Chain[] = [
  {
    chainName: EVM_BLOCKCHAIN_NAME.ARBITRUM,
    chainId: 42161,
    coingeckoApiId: 'arbitrum-one',
    logoURI: 'https://assets.coingecko.com/coins/images/16547/standard/photo_2023-03-29_21.47.00.jpeg',
    canBeSource: true,
    domain: 3,
    usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    rpc: 'https://arb1.arbitrum.io/rpc',
    bridgeAddress: '0xa8B9DF47Ea16aB48ecf212B48a1F84b9DD4Fd0F0',
    receiverContract: '0x2025731CE82868DDDF81F2f265634f1dA6e7BE2d',
    explorer: 'https://arbiscan.io',
    uniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    timeSecond: 780
  },
  {
    chainName: EVM_BLOCKCHAIN_NAME.AVALANCHE,
    chainId: 43114,
    coingeckoApiId: 'avalanche',
    logoURI: 'https://assets.coingecko.com/coins/images/12559/standard/Avalanche_Circle_RedWhite_Trans.png',
    canBeSource: false,
    domain: 1,
    usdc: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io',
    uniswapV3Factory: '0x740b1c1de25031C31FF4fC9A62f554A55cdC1baD',
    bridgeAddress: '0x32284883b927e060Bd6650911658D081b6b0D38E',
    receiverContract: '0xA491552e80e7D3F2C728c7422e6509e9E88b75d9',
    timeSecond: 20
  },
  {
    chainName: EVM_BLOCKCHAIN_NAME.ETHEREUM,
    chainId: 1,
    coingeckoApiId: 'ethereum',
    logoURI: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
    canBeSource: false,
    domain: 0,
    usdc: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    rpc: 'https://rpc.ankr.com/eth',
    explorer: 'https://etherscan.io',
    uniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    // bridgeAddress: ,
    // receiverContract: ,
    timeSecond: 780
  },

  {
    chainName: EVM_BLOCKCHAIN_NAME.OPTIMISM,
    chainId: 10,
    coingeckoApiId: 'optimistic-ethereum',
    logoURI: 'https://assets.coingecko.com/coins/images/25244/standard/Optimism.png',
    canBeSource: false,
    domain: 2,
    usdc: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    rpc: 'https://mainnet.optimism.io',
    explorer: 'https://optimistic.etherscan.io',
    uniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    bridgeAddress: '0x32284883b927e060Bd6650911658D081b6b0D38E',
    receiverContract: '0xA491552e80e7D3F2C728c7422e6509e9E88b75d9',
    timeSecond: 780
  },

  {
    chainName: EVM_BLOCKCHAIN_NAME.BASE,
    chainId: 8453,
    coingeckoApiId: 'base',
    logoURI: 'https://www.base.org/document/favicon-32x32.png',
    canBeSource: false,
    domain: 6,
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    rpc: 'https://1rpc.io/base', // 'https://mainnet.base.org', // 'https://1rpc.io/base',
    explorer: 'https://basescan.org',
    bridgeAddress: '0x76ad9e4aE5c4Eb3e52A8D23636fbaa04E63a9601',
    receiverContract: '0xd99D4B158a7F5dcb09079fDA4EfDb4f21Cd68e69',
    uniswapV3Factory: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
    timeSecond: 780
  },

  {
    chainName: EVM_BLOCKCHAIN_NAME.POLYGON,
    chainId: 137,
    coingeckoApiId: 'polygon-pos',
    logoURI: 'https://assets.coingecko.com/coins/images/4713/standard/polygon.png',
    canBeSource: false,
    domain: 7,
    usdc: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    rpc: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    uniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    bridgeAddress: '0x2911445aF5144402839284ddC2E1a3B7B580DC99',
    receiverContract: '0x9b8C3bf7bC255F5a4F05BfF19Cb74A2EB2fafEc7',
    timeSecond: 480
  },
]