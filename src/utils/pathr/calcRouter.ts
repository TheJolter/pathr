import InputStore from "@/stores/InputStore";
import PathrStore from "@/stores/PathrStore";
import bn from "../bn";
import { configuration } from "@/configs/pathr/sdk-config";
import { BlockchainName, CHAIN_TYPE, OnChainTrade, SDK } from "pathr-sdk";
// import getEthereum from "../getEthereum";
import EvmWalletStore from "@/stores/EvmWalletStore";
import { EIP1193Provider } from "@web3-onboard/core";

export default function calcRouter(params: {
  pathrStore: PathrStore,
  inputStore: InputStore,
  // evmWalletStore: EvmWalletStore
  address?: string,
  provider?: EIP1193Provider
}) : Promise<void> {
  const {pathrStore, inputStore, address, provider} = params
  pathrStore?.setTrades([])
  pathrStore.setCalculating(true);
  const {fromChainName, fromChainTokenAddr, toChainName, toChainTokenAddr} = pathrStore
  return new Promise(async (resolve, reject)=>{
    if (
      bn(inputStore.tokenAmout||0).lte(0)
      || !fromChainName
      || !fromChainTokenAddr
      || !toChainName
      || !toChainTokenAddr
    ) {
      reject({code: 202401230921})
      return
    }

    const core:any = provider // getEthereum({evmWalletStore})
    console.log('core', core)
    console.log('ethereum', window.ethereum)
    let walletProvider = undefined
    if (core && address) {
      walletProvider = {[CHAIN_TYPE.EVM]: {core, address: address}}
    }
    const sdk = await SDK.createSDK({
      ...configuration,
      walletProvider
    })

    if (fromChainName===toChainName) {
      sdk.onChainManager.calculateTrade(
        {
          address: fromChainTokenAddr,
          blockchain: fromChainName as BlockchainName
        }, 
        inputStore.tokenAmout, 
        toChainTokenAddr
      ).then(onChainTrade=>{
        const _trades = onChainTrade.filter(item=>{return item &&!('error' in item)}) as OnChainTrade[]
        _trades.sort((first, second)=>{
          const firstValue = bn(first.to?.weiAmount?.toString()||0).div(bn(10).pow(first.to?.decimals||0))
          const secondValue = bn(second.to?.weiAmount?.toString()||0).div(bn(10).pow(second.to?.decimals||0))
          return firstValue.gt(secondValue)?-1:1
        })
        // pathrStore.setTrades(_trades.slice().reverse())
        pathrStore.setTrades(_trades)
        resolve()
      }).catch((err)=>{
        console.error('err sdk.onChainManager.calculateTrade', err)
        reject(err)
      })
      return
    }

    sdk.crossChainManager.calculateTrade(
      {
        address: fromChainTokenAddr,
        blockchain: fromChainName as BlockchainName
      }, 
      inputStore.tokenAmout,
      {
        address: toChainTokenAddr,
        blockchain: toChainName as BlockchainName
      }
    ).then(wrappedCrossChainTrade=>{
      const _trades = wrappedCrossChainTrade.filter(item=>{return !('error' in item)})
      _trades.sort((first, second)=>{
        const firstValue = bn(first.trade?.to?.weiAmount?.toString()||0).div(bn(10).pow(first.trade?.to?.decimals||0))
        const secondValue = bn(second.trade?.to?.weiAmount?.toString()||0).div(bn(10).pow(second.trade?.to?.decimals||0))
        return firstValue.gt(secondValue)?-1:1
      })
      pathrStore.setTrades(_trades)
      resolve()
    }).catch((err)=>{
      console.error('err sdk.crossChainManager.calculateTrade', err)
      reject(err)
    })
  })
}