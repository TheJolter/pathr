import getEthereum from "./getEthereum"

export default function evmSwitchChain(chainId: string): Promise<any> {
  const ethereum = getEthereum()
  return new Promise((resolve, reject)=>{
    if (!ethereum) {
      reject({code: 202312061635, msg: 'Wallet not found'})
      return
    }
    ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId}],
    }).then(()=>{
      resolve(null)
    }).catch((err:any)=>{ // if err.code === 4902 indicates that the chain has not been added to MetaMask
      reject(err)
    })
  })
  
}