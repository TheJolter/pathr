import { BlockchainInfo } from "@/configs/pathr/blockchain-info"
import { chains } from '../chains'

export default function ifShowUSDCIBC(
  chainName1: string|null,
  chainName2: string|null,
) {
  if (!chainName1||!chainName2) return false
  let chainID1String: string, chainID2String: string
  if (chainName1==='Joltify') {
    chainID1String = 'joltify_1729-1'
  } else if (chainName1==='Noble') {
    chainID1String = 'noble-1'
  } else {
    const chainIdNumber = BlockchainInfo[chainName1].id
    chainID1String = '0x' + chainIdNumber.toString(16)
  }
  
  if (chainName2==='Joltify') {
    chainID2String = 'joltify_1729-1'
  } else if (chainName2==='Noble') {
    chainID2String = 'noble-1'
  } else {
    const chainIdNumber = BlockchainInfo[chainName2].id
    chainID2String = '0x' + chainIdNumber.toString(16)
  }

  const ifShow = (
    !!chains.find((chain) => chain.chainID === chainID1String) &&
    !!chains.find((chain) => chain.chainID === chainID2String) &&
    (['Joltify', 'Noble'].includes(chainName1) || ['Joltify', 'Noble'].includes(chainName2))
  )

  console.log({ifShow, chainName1, chainName2, chainID1String, chainID2String})

  return ifShow
}