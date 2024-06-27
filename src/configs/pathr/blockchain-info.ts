import { EVM_BLOCKCHAIN_NAME } from "pathr-sdk";

export const BlockchainInfo: Record<
  string,
  {
    id: number,
    chainLabel: string, // usage: https://assets.rubic.exchange/assets/aurora/0xe3520349f477a5f6eb06107066048508498a291b/logo.png
    explorer?: string,
  }
> = {
  [EVM_BLOCKCHAIN_NAME.ETHEREUM]: {
    id: 1,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/eth-contrast.svg',
    explorer: 'https://etherscan.io'
  },
  [EVM_BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
    id: 56,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/bnb.svg',
    explorer: 'https://bscscan.com'
  },
  [EVM_BLOCKCHAIN_NAME.POLYGON]: {
    id: 137,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/polygon.svg',
    explorer: 'https://polygonscan.com'
  },
  [EVM_BLOCKCHAIN_NAME.OPTIMISM]: {
    id: 10,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/optimism.svg',
    explorer: 'https://optimistic.etherscan.io'
  },
  [EVM_BLOCKCHAIN_NAME.ARBITRUM]: {
    id: 42161,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/arbitrum.svg',
    explorer: 'https://arbiscan.io'
  },
  [EVM_BLOCKCHAIN_NAME.GNOSIS]: {
    id: 100,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/gnosis.svg',
    explorer: 'https://gnosisscan.io'
  },
  [EVM_BLOCKCHAIN_NAME.AVALANCHE]: {
    id: 43114,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/avalanche.svg',
    explorer: 'https://snowtrace.io'
  },
  [EVM_BLOCKCHAIN_NAME.FANTOM]: {
    id: 250,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/fantom.svg',
    explorer: 'https://ftmscan.com'
  },
  [EVM_BLOCKCHAIN_NAME.AURORA]: {
    id: 1313161554,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/aurora.svg',
    explorer: 'https://explorer.aurora.dev'
  },
  [EVM_BLOCKCHAIN_NAME.KLAYTN]: {
    id: 8217,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/klaytn.svg',
    explorer: 'https://scope.klaytn.com'
  },
  [EVM_BLOCKCHAIN_NAME.ZK_SYNC]: {
    id: 324,
    chainLabel: 'https://app.rubic.exchange/assets/images/icons/coins/zksync.svg',
    explorer: 'https://explorer.zksync.io'
  },
  [EVM_BLOCKCHAIN_NAME.BASE]: {
    id: 8453,
    chainLabel: 'https://www.base.org/document/favicon-32x32.png',
    explorer: 'https://base.blockscout.com'
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