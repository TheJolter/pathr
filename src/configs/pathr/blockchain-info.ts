import { EVM_BLOCKCHAIN_NAME } from "pathr-sdk";

export const BlockchainInfo: Record<
  string,
  {
    id: number,
    chainLabel: string, // usage: https://assets.rubic.exchange/assets/aurora/0xe3520349f477a5f6eb06107066048508498a291b/logo.png
    explorer?: string,
    imgKey?: string // https://assets.rubic.exchange/assets/binance-smart-chain/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c/logo.png
  }
> = {
  [EVM_BLOCKCHAIN_NAME.ETHEREUM]: {
    id: 1,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/eth-contrast.svg',
    explorer: 'https://etherscan.io',
    imgKey: 'ethereum'
  },
  [EVM_BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
    id: 56,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/bnb.svg',
    explorer: 'https://bscscan.com',
    imgKey: 'binance-smart-chain'
  },
  [EVM_BLOCKCHAIN_NAME.POLYGON]: {
    id: 137,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/polygon.svg',
    explorer: 'https://polygonscan.com',
    imgKey: 'polygon'
  },
  [EVM_BLOCKCHAIN_NAME.OPTIMISM]: {
    id: 10,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/optimism.svg',
    explorer: 'https://optimistic.etherscan.io',
    imgKey: 'optimistic-ethereum'
  },
  [EVM_BLOCKCHAIN_NAME.ARBITRUM]: {
    id: 42161,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/arbitrum.svg',
    explorer: 'https://arbiscan.io',
    imgKey: 'arbitrum'
  },
  [EVM_BLOCKCHAIN_NAME.GNOSIS]: {
    id: 100,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/gnosis.svg',
    explorer: 'https://gnosisscan.io',
    imgKey: 'xdai'
  },
  [EVM_BLOCKCHAIN_NAME.AVALANCHE]: {
    id: 43114,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/avalanche.svg',
    explorer: 'https://snowtrace.io',
    imgKey: 'avalanche'
  },
  [EVM_BLOCKCHAIN_NAME.FANTOM]: {
    id: 250,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/fantom.svg',
    explorer: 'https://ftmscan.com',
    imgKey: 'fantom'
  },
  [EVM_BLOCKCHAIN_NAME.AURORA]: {
    id: 1313161554,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/aurora.svg',
    explorer: 'https://explorer.aurora.dev',
    imgKey: 'aurora'
  },
  [EVM_BLOCKCHAIN_NAME.KLAYTN]: {
    id: 8217,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/klaytn.svg',
    explorer: 'https://scope.klaytn.com',
    imgKey: 'klaytn'
  },
  [EVM_BLOCKCHAIN_NAME.ZK_SYNC]: {
    id: 324,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/zksync.svg',
    explorer: 'https://explorer.zksync.io',
    imgKey: 'zksync'
  },
  [EVM_BLOCKCHAIN_NAME.BASE]: {
    id: 8453,
    chainLabel: 'https://www.base.org/document/favicon-32x32.png',
    explorer: 'https://basescan.org',
    imgKey: 'base'
  },

  // [EVM_BLOCKCHAIN_NAME.KAVA]: {
  //   id: 2222,
  //   chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/kava.png'
  // }
}

export function getChainNameByChainId(chainId: number) {
  for (const chainName in BlockchainInfo) {
    if (BlockchainInfo[chainName].id===chainId) {
      return chainName
    }
  }
}