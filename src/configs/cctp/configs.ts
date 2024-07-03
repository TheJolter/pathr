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
  bridgeAddress?: string,
  explorer: string
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
    bridgeAddress: '0xacbd54A1639702b7D27Cc525F705b4EEAEF16ef9',
    explorer: 'https://arbiscan.io'
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
    explorer: 'https://snowtrace.io'
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
    explorer: 'https://etherscan.io'
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
    explorer: 'https://optimistic.etherscan.io'
  },

  {
    chainName: EVM_BLOCKCHAIN_NAME.BASE,
    chainId: 8453,
    coingeckoApiId: 'base',
    logoURI: 'https://www.base.org/document/favicon-32x32.png',
    canBeSource: false,
    domain: 6,
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    rpc: 'https://1rpc.io/base',
    explorer: 'https://base.blockscout.com'
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
    explorer: 'https://polygonscan.com'
  },
]