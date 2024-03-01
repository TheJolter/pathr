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
      rpcList: ['https://arb1.arbitrum.io/rpc'],
      mainRpcTimeout: 8000
    },
    [EVM_BLOCKCHAIN_NAME.FANTOM]: {
      rpcList: ['https://rpcapi.fantom.network'],
      mainRpcTimeout: 8000
    },
    [EVM_BLOCKCHAIN_NAME.AVALANCHE]: {
      rpcList: [
        // 'https://api.avax.network/ext/bc/C/rpc', // success local, failed remote
        // 'https://avalanche.drpc.org', // success local
        // 'https://avax.meowrpc.com', // failed to find router local
        // 'https://1rpc.io/avax/c', // success local
        'https://avalanche.public-rpc.com', // success local
      ],
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

  providerAddress: { // partner
    [CHAIN_TYPE.EVM]: {
      crossChain: '0xA71AeeAbA12f994a5B1B645F84273A6596d082b3', // Address for cross chain fee
      onChain: '0x38b0216ab8D66D299cCf5787AAcb303C5581755B' // Address for on chain fee
    }
  }
}
