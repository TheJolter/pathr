import EvmWalletStore from "../stores/EvmWalletStore";
import getEthereum from "./getEthereum";

export default function connectEvmWallet(params: {
  evmWalletStore: EvmWalletStore
}): Promise<any> {
  const {evmWalletStore} = params
  const ethereum = getEthereum()
  return new Promise((resolve, reject)=>{
    if (!ethereum) {
      reject({code: 202312061712, msg: 'wallet not found'})
      return
    }
    ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: string[])=>{ // use eth_requestAccounts, not eth_accounts
      console.log({accounts}) // might be empty [] if use 'eth_accounts'
      if (accounts.length===0) {
        reject({code: 202312080016, msg: 'not account responsed'})
        return
      }
      evmWalletStore.login(accounts[0])
      resolve(null)
    }).catch((err: any) => {
      reject(err)
    })
  })
 
}