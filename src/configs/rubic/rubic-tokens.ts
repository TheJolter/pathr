import { EVM_BLOCKCHAIN_NAME } from "pathr-sdk";


export const blockchainNetwork_blockchain = {
  ethereum: EVM_BLOCKCHAIN_NAME.ETHEREUM,
  'binance-smart-chain': EVM_BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN,
  polygon: EVM_BLOCKCHAIN_NAME.POLYGON,
  zksync: EVM_BLOCKCHAIN_NAME.ZK_SYNC,
  aurora: EVM_BLOCKCHAIN_NAME.AURORA,
  arbitrum: EVM_BLOCKCHAIN_NAME.ARBITRUM,
  fantom: EVM_BLOCKCHAIN_NAME.FANTOM,
  avalanche: EVM_BLOCKCHAIN_NAME.AVALANCHE,
  xdai: EVM_BLOCKCHAIN_NAME.GNOSIS, // gnosis？？xdai？？
  klaytn: EVM_BLOCKCHAIN_NAME.KLAYTN,
  'optimistic-ethereum': EVM_BLOCKCHAIN_NAME.OPTIMISM
}

// from https://tokens.rubic.exchange/api/v1/tokens/?pageSize=200&network=ethereum res.results
export const pathrTokens = [
  
]