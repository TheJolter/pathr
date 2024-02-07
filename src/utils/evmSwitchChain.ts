import EvmWalletStore from "@/stores/EvmWalletStore"
import { EIP1193Provider } from "@web3-onboard/core"

export default function evmSwitchChain(chainId: string, params: {
  provider?: EIP1193Provider
}): Promise<any> {
  const {provider} = params
  const ethereum = provider
  return new Promise((resolve, reject)=>{
    if (!ethereum) {
      reject({code: 202312061635, msg: 'Wallet not found'})
      return
    }
    ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId}],
    }).then(()=>{
      setTimeout(()=>{
        resolve(null)
      }, 1000)
    }).catch((err:any)=>{ // if err.code === 4902 indicates that the chain has not been added to MetaMask
      reject(err)
    })
  })
  
}