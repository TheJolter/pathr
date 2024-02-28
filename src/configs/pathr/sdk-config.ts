import { EVM_BLOCKCHAIN_NAME, CHAIN_TYPE, Configuration } from 'pathr-sdk';

export const configuration:Configuration = {
  rpcProviders: {
    [EVM_BLOCKCHAIN_NAME.ETHEREUM]: {
      rpcList: ['https://rpc.ankr.com/eth', 'https://ethereum.publicnode.com'],
      mainRpcTimeout: 8000
    },
    [EVM_BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
      rpcList: ['https://bsc-dataseed.binance.org/', 'https://bsc-dataseed2.binance.org', 'https://bsc-dataseed3.binance.org', 'https://rpc.ankr.com/bsc', 'https://bsc.publicnode.com'],
      mainRpcTimeout: 8000
    },
    [EVM_BLOCKCHAIN_NAME.POLYGON]: {
      rpcList: ['https://polygon-rpc.com', 'https://polygon.llamarpc.com'],
      mainRpcTimeout: 8000
    },
    
    
    [EVM_BLOCKCHAIN_NAME.ZK_SYNC]: {
      rpcList: ['https://mainnet.era.zksync.io'],
      mainRpcTimeout: 8000
    },
    [EVM_BLOCKCHAIN_NAME.AURORA]: {
      rpcList: ['https://endpoints.omniatech.io/v1/aurora/mainnet/public'],
      mainRpcTimeout: 8000
    },
    [EVM_BLOCKCHAIN_NAME.ARBITRUM]: {
      rpcList: ['https://arb1.arbitrum.io/rpc', ''],
      mainRpcTimeout: 8000
    },
    [EVM_BLOCKCHAIN_NAME.FANTOM]: {
      rpcList: ['https://rpcapi.fantom.network'],
      mainRpcTimeout: 8000
    },
    [EVM_BLOCKCHAIN_NAME.AVALANCHE]: {
      rpcList: ['https://api.avax.network/ext/bc/C/rpc'],
      mainRpcTimeout: 8000
    },
    [EVM_BLOCKCHAIN_NAME.GNOSIS]: {
      rpcList: ['https://rpc.gnosischain.com'],
      mainRpcTimeout: 8000
    },
    [EVM_BLOCKCHAIN_NAME.KLAYTN]: {
      rpcList: ['https://public-node-api.klaytnapi.com/v1/cypress'],
      mainRpcTimeout: 8000
    },
    [EVM_BLOCKCHAIN_NAME.OPTIMISM]: {
      rpcList: ['https://mainnet.optimism.io'],
      mainRpcTimeout: 8000
    },



    [EVM_BLOCKCHAIN_NAME.KAVA]: {
      rpcList: ['https://evm.kava.io', 'https://evm2.kava.io'],
      mainRpcTimeout: 8000
    },
  },

  // providerAddress: {
  //   [CHAIN_TYPE.EVM]: {
  //     crossChain: '0x32f71714709e2a9D411a03638a9aA920499BcB0A', // Address for cross chain fee
  //     onChain: '0xbD8e73Dc667e8B5a231e525a6d5405c832B61030' // Address for on chain fee
  //   }
  // }
}
