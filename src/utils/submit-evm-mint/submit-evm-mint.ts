import { evmChainInfos } from "./config"
import { TransactionReceipt, TransactionResponse, ethers } from 'ethers'
import abi from './abi.json'

export const submitEvmMint = ({
  domain, message
}:{
  domain: number,
  message: {
    attestation: string,
    message: string,
    eventNonce: string
  },
}): Promise<TransactionReceipt> => {
  return new Promise(async (resolve, reject)=>{
    if (!process.env.MINTER_PRIVATE_KEY) return reject('MINTER_PRIVATE_KEY not found')

    const evmChainInfo = evmChainInfos.find(e=>e.domain===domain)
    if (!evmChainInfo) return reject('evmChainInfo not found')
    const {Messagetransmitter, rpc} = evmChainInfo

    const provider = new ethers.JsonRpcProvider(rpc)
    const wallet = new ethers.Wallet(process.env.MINTER_PRIVATE_KEY)
    // const messageBytes = ethers.toUtf8Bytes(message.message)
    // const attestationBytes = ethers.toUtf8Bytes(message.attestation)
    const contractAddress = Messagetransmitter
    const walletConnected = wallet.connect(provider)
    const contract = new ethers.Contract(contractAddress, abi, walletConnected)

    try {
      const fee = {
        gasLimit: 15000000,
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
        maxFeePerGas: ((await provider.getFeeData()).maxFeePerGas||BigInt(0)) + ethers.parseUnits('2', 'gwei')
      }
      console.log('fee info', fee)
      const response = await contract.receiveMessage(message.message, message.attestation, 
        // fee
      ) as TransactionResponse
      const receipt = await response.wait() as TransactionReceipt
      resolve(receipt)
    } catch (error) {
      reject({status: -1, error})
    }
  })
}