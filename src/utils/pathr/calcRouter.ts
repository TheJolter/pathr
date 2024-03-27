import InputStore from "@/stores/InputStore";
import PathrStore from "@/stores/PathrStore";
import bn from "../bn";
import { configuration } from "@/configs/pathr/sdk-config";
import { BLOCKCHAIN_NAME, CHAIN_TYPE, SDK as PathrSDK } from "pathr-sdk";
import { EIP1193Provider } from "@web3-onboard/core";
import { SDK as RubicSDK } from "rubic-sdk";
import { OWN_CHAINS } from "@/configs/common";

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
  console.log('calcRouter', {fromChainName, toChainName}, fromChainName===toChainName)
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

    let SDK = RubicSDK
    if (OWN_CHAINS.includes(fromChainName as any)) {
      SDK = PathrSDK as any
    }

    const sdk = await SDK.createSDK({
      ...configuration,
      walletProvider
    })

    if (fromChainName===toChainName) {
      sdk.onChainManager.calculateTrade(
        {
          address: fromChainTokenAddr,
          blockchain: fromChainName as any
        }, 
        inputStore.tokenAmout, 
        toChainTokenAddr,
        {
          slippageTolerance: 0.01
        }
      ).then(onChainTrade=>{
        console.log('sdk.onChainManager.calculateTrade onChainTrade', onChainTrade)
        const _trades = onChainTrade.filter(item=>{return item &&!('error' in item)}) as any
        _trades.sort((first:any, second:any)=>{
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
        blockchain: fromChainName as any
      }, 
      inputStore.tokenAmout,
      {
        address: toChainTokenAddr,
        blockchain: toChainName as any
      },
      {
        disabledProviders: ['multichain'],
        lifiDisabledBridgeTypes: ['multichain'],
        slippageTolerance: 0.02 // default 0.03 will result in lifi return empty routers
      }
    ).then(wrappedCrossChainTrade=>{
      console.log('wrappedCrossChainTrade', wrappedCrossChainTrade)
      const _trades = wrappedCrossChainTrade.filter(item=>{return !('error' in item)}) as any
      _trades.sort((first: any, second: any)=>{
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