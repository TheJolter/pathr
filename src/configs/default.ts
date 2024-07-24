import { EVM_BLOCKCHAIN_NAME } from "pathr-sdk"

export const DEFAULT_TOKENS = {
  bridge: {
    from: {
      chainName: EVM_BLOCKCHAIN_NAME.ARBITRUM,
      tokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'.toLowerCase()
    },
    to: {
      chainName: EVM_BLOCKCHAIN_NAME.BASE,
      tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'.toLowerCase()
    }
  },
  swap: {
    from: {
      chainName: EVM_BLOCKCHAIN_NAME.ARBITRUM,
      tokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'.toLowerCase()
    },
    to: {
      chainName: EVM_BLOCKCHAIN_NAME.BASE,
      tokenAddress: '0x4200000000000000000000000000000000000006'.toLowerCase()
    }
  }
}