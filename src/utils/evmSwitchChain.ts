import EvmWalletStore from "@/stores/EvmWalletStore"
import getEthereum from "./getEthereum"

export default function evmSwitchChain(chainId: string, params: {evmWalletStore: EvmWalletStore}): Promise<any> {
  const {evmWalletStore} = params
  const ethereum = getEthereum({evmWalletStore})
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