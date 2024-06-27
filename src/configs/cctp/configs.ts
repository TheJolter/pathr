import { EVM_BLOCKCHAIN_NAME } from "pathr-sdk"

type Chain = {
  chainName: string,
  chainId: number,
  coingeckoApiId?: string, // https://tokens.coingecko.com/arbitrum-one/all.json
  logoURI?: string,
  canBeSource: boolean,
  domain: number,
}
export const CHAINS:Chain[] = [
  {
    chainName: EVM_BLOCKCHAIN_NAME.ARBITRUM,
    chainId: 42161,
    coingeckoApiId: 'arbitrum-one',
    logoURI: 'https://assets.coingecko.com/coins/images/16547/standard/photo_2023-03-29_21.47.00.jpeg',
    canBeSource: true,
    domain: 3
  },
  {
    chainName: EVM_BLOCKCHAIN_NAME.AVALANCHE,
    chainId: 43114,
    coingeckoApiId: 'avalanche',
    logoURI: 'https://assets.coingecko.com/coins/images/12559/standard/Avalanche_Circle_RedWhite_Trans.png',
    canBeSource: false,
    domain: 1,
  },
  {
    chainName: EVM_BLOCKCHAIN_NAME.ETHEREUM,
    chainId: 1,
    coingeckoApiId: 'ethereum',
    logoURI: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
    canBeSource: false,
    domain: 0
  },

  {
    chainName: EVM_BLOCKCHAIN_NAME.OPTIMISM,
    chainId: 10,
    canBeSource: false,
    domain: 2
  },

  {
    chainName: EVM_BLOCKCHAIN_NAME.BASE,
    chainId: 8453,
    coingeckoApiId: 'base',
    logoURI: 'https://www.base.org/document/favicon-32x32.png',
    canBeSource: false,
    domain: 6
  },

  {
    chainName: EVM_BLOCKCHAIN_NAME.POLYGON,
    chainId: 137,
    canBeSource: false,
    domain: 7
  },
]