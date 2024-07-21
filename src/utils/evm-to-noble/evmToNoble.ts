import { EvmChain, chains } from "@/config/chains"
import { ethers, TransactionResponse, TransactionReceipt } from "ethers"
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
}): Promise<TransactionReceipt> {
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

    const provider = new ethers.BrowserProvider(ethereum)
    let signer:ethers.JsonRpcSigner
    try {
      signer= await provider.getSigner()
    } catch (error) {
      reject(error)
      return
    }
    const contract = new ethers.Contract(sourceChain.tokenMessenger, abi, signer)
    contract.depositForBurn(
      ethers.parseUnits(amount, 6),
      4, // domain of noble
      getMintRecipientFromCosmosAddress(targetAddress),
      sourceChain.usdcAddress
    ).then((txRes: TransactionResponse)=>{
      txRes.wait().then((txRpt)=>{
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