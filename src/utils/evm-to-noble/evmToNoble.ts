import { EvmChain, chains } from "@/components/USDC/chains"
import { ethers } from "ethers"
import abi from './tokenMessengerAbi.json'
import getMintRecipientFromCosmosAddress from './getMintRecipientFromCosmosAddress'

export default function evmToNoble({
  sourceChainID,
  amount,
  targetAddress // noble address
}:{
  sourceChainID: string,
  amount: string,
  targetAddress: string
}): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const sourceChain = chains.find(chain => (
      chain.chainID === sourceChainID
    )) as EvmChain
    const ethereum = (window as any).ethereum as any

    if (!ethereum) {
      reject(new Error(`No ethereum wallet found`))
      return
    }

    if (ethereum.chainId !== sourceChainID ) {
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: sourceChainID }]
        })
      } catch (error) {
        reject(error)
        return
      }
    }

    const provider = new ethers.providers.Web3Provider(ethereum)
    let signer:ethers.Signer
    try {
      signer= await provider.getSigner()
    } catch (error) {
      reject(error)
      return
    }
    const contract = new ethers.Contract(sourceChain.tokenMessenger, abi, signer)
    contract.depositForBurn(
      ethers.utils.parseUnits(amount, 6),
      4, // domain of noble
      getMintRecipientFromCosmosAddress(targetAddress),
      sourceChain.usdcAddress
    ).then((txRes: any)=>{
      txRes.wait().then((txRpt:any)=>{
        if (txRpt===null) {
          reject(new Error(`Transaction failed, txRpt is null`))
          return
        }
        resolve(txRpt)
      }).catch((error:any)=>{
        reject(error)
      })
    }).catch((error:any)=>{
      reject(error)
    })
  })
}