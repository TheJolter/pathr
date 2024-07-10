import { BlockchainInfo } from "@/configs/pathr/blockchain-info";

export default function getTokenImg({
  chainID, tokenAddress
}:{
  chainID: number,
  tokenAddress: string
}) {
  let imgKey: string|undefined
  for (const chainName in BlockchainInfo) {
    if (BlockchainInfo[chainName].id === chainID) {
      imgKey = BlockchainInfo[chainName].imgKey
      break
    }
  }
  if (!imgKey) return 'https://e7.pngegg.com/pngimages/153/807/png-clipart-timer-clock-computer-icons-unknown-planet-digital-clock-time.png'
  return `https://assets.rubic.exchange/assets/${imgKey}/${tokenAddress}/logo.png`.toLowerCase()
}