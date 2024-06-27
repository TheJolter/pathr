type Chain = {
  chainName: string,
  chainId: number,
  coingeckoApiId: string, // https://tokens.coingecko.com/arbitrum-one/all.json
  logoURI: string,
  canBeSource: boolean,
}
export const CHAINS:Chain[] = [
  {
    chainName: 'Arbitrum-one',
    chainId: 42161,
    coingeckoApiId: 'arbitrum-one',
    logoURI: 'https://assets.coingecko.com/coins/images/16547/standard/photo_2023-03-29_21.47.00.jpeg',
    canBeSource: true
  },
  {
    chainName: 'Avalanche-C',
    chainId: 43114,
    coingeckoApiId: 'avalanche',
    logoURI: 'https://assets.coingecko.com/coins/images/12559/standard/Avalanche_Circle_RedWhite_Trans.png',
    canBeSource: false
  },
  {
    chainName: 'Ethereum',
    chainId: 1,
    coingeckoApiId: 'ethereum',
    logoURI: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
    canBeSource: false
  },
]