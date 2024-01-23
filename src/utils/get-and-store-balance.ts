import { BigNumberish, ethers } from "ethers";
import { BalanceStore, Balances } from "@/stores/BalanceStore";
import getRpcByChainId from "./get-prc-by-chain-id";
import BigNumber from "bignumber.js";

const address0 = '0x0000000000000000000000000000000000000000'

export default function getAndSotreBalance(params: {
  balanceStore: BalanceStore,
  chainId: string|number,
  tokenAddress: string, // 0x000 is native
  account: string,
  getBakanceKey?: (bakanceKey: string)=>void
}): Promise<Balances> {
  const {balanceStore, chainId, tokenAddress, account, getBakanceKey} = params
  // console.log('getAndSotreBalance', {chainId, tokenAddress, account})
  const chainIdString = typeof chainId==='number'?chainId.toString(16):Number(chainId).toString(16)
  const key = `${chainIdString}-${tokenAddress}-${account}`.toLowerCase()
  getBakanceKey?.(key)
  return new Promise((resolve, reject)=>{
    const rpc = getRpcByChainId(chainId)
    if (!rpc) {
      reject(`rpc of chain id ${chainId} not found`)
      return
    }
    const provider = new ethers.providers.JsonRpcProvider(rpc)
    
    if (tokenAddress===address0) {
      provider.getBalance(account).then((balanceBN: BigNumberish) => {
        const decimals = 18
        const balance = {
          [key]: {
            amount: new BigNumber(balanceBN.toString()).div(new BigNumber(10).pow(decimals)),
            decimals
          }
        }
        balanceStore.addBalance(balance)
        resolve(balance)
      }).catch((err: any)=>{
        console.error('error getBalance', err)
        reject(`error getBalance ${account} on chain ${chainIdString} of native token`)
      })
      return
    }

    // evm20 token
    const contract = new ethers.Contract(
      tokenAddress, 
      ['function balanceOf(address) view returns(uint256)', 'function decimals() view returns(uint8)'], 
      provider
    )
    contract.balanceOf(account).then((balanceBN: BigNumberish) => {
      contract.decimals().then((decimalBN: BigNumberish)=>{
        const decimals = Number(decimalBN.toString())
        const balance = {
          [key]: {
            amount: new BigNumber(balanceBN.toString()).div(new BigNumber(10).pow(decimals)),
            decimals
          }
        }
        balanceStore.addBalance(balance)
        resolve(balance)
      }).catch((err: any)=>{
        console.error('error getting decimals', err)
        reject(`error getting decimals of token ${tokenAddress} on chain ${chainIdString} `)
      })
    }).catch((err: any)=>{
      console.error('error balanceOf', err)
      reject(`error balanceOf ${account} on chain ${chainIdString} of token ${tokenAddress}`)
    })
  })
}