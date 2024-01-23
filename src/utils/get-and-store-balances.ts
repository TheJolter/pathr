import axios from "axios";
import { BlockchainInfo } from "@/configs/rubic/blockchain-info";
import { BalanceStore } from "@/stores/BalanceStore";
import tokens from '@/configs/rubic/all-tokens.json'
import BigNumber from "bignumber.js";
import getAndSotreBalance from "./get-and-store-balance";
import { ADDR0 } from "@/configs/rubic/tokens";

const chainbaseIds = [1, 137, 56, 43114, 42161, 10, 8453, 324]

export default async function getAndStoreBalances(params: {
  balanceStore: BalanceStore,
  account: string
}) {
  const {balanceStore, account} = params
  if (!account) return
  if (balanceStore.fetchedAddresses.includes(account)) return
  balanceStore.addFetchedAddress(account)
  for (const chainName in BlockchainInfo) {
    const chainInfo = BlockchainInfo[chainName]
    const chainId = chainInfo.id
    getAndSotreBalance({
      balanceStore,
      chainId,
      tokenAddress: ADDR0, // 0x000 is native
      account
    }).catch(err=>{
      console.error('error getAndSotreBalance', err)
    })
    if (!chainbaseIds.includes(chainId)) continue
    try {
      const {data} = (await axios(`https://api.chainbase.online/v1/account/tokens?chain_id=${chainId}&address=${account}&limit=100&page=1`, {
        headers: {'x-api-key': 'demo'}
      })).data // page 1 and 0 is the same
      for (const chainbaseInfo of data) {
        const tokenAddress = chainbaseInfo.contract_address
        if (!tokens.find(item=>{return item.address===chainbaseInfo.contract_address})) continue
        // chainbaseInfo.balance // balance wei hex
        const decimals = chainbaseInfo.decimals // number
        const amount = new BigNumber(chainbaseInfo.balance).div(10**decimals)
        const key = `${chainId.toString(16)}-${tokenAddress}-${account}`.toLowerCase()// 'chainId(hex)-contract-account' // all in lower case
        balanceStore.addBalance({[key]: {amount, decimals}})
      }
      await new Promise((resolve,_)=>{setTimeout(()=>{resolve(null)}, 2000)})
    } catch(err) {
      console.error('axios chainbase error', err)
    }
  }
}