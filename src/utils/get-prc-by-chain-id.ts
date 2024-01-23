import { BlockchainInfo } from "../configs/rubic/blockchain-info"
import { configuration } from "../configs/rubic/sdk-config"

export default function getRpcByChainId(chainId: number|string) {
  const chainIdNumber = typeof chainId==='number'?chainId:Number(chainId)
  for (const blockChainName in BlockchainInfo) {
    if (BlockchainInfo[blockChainName].id===chainIdNumber) {
      return configuration.rpcProviders[blockChainName].rpcList[0]
    }
  }
}