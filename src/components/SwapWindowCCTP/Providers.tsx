'use client'

import { useEffect, useState } from "react"
import Provider from "./Provider"
import {CircularProgress} from "@nextui-org/react"
import { useStore } from "@/stores/hooks"
import { observer } from "mobx-react-lite"
import { useConnectWallet } from "@web3-onboard/react"
import calcRouter from "@/utils/cctp/calcRouter"
import { Token } from "@uniswap/sdk-core"
import { CHAINS } from "@/configs/cctp/configs"
import { getSwapInfo } from "@/utils/cctp/uniswap-v3-calc"
import ProviderCCTP from "./ProviderCCTP"
import { isGreaterThanZero } from "@/utils/isStringPositiveNumber"
import calcRouterPathr from "@/utils/pathr/calcRouter"
import { EVM_BLOCKCHAIN_NAME } from "pathr-sdk"
import tokensWithUsdcPools from '@/configs/cctp/usdc-pools.json'

export const CCTP_CHAIN_NAMES = [
  EVM_BLOCKCHAIN_NAME.ARBITRUM,
  EVM_BLOCKCHAIN_NAME.AVALANCHE,
  EVM_BLOCKCHAIN_NAME.ETHEREUM,
  EVM_BLOCKCHAIN_NAME.OPTIMISM,
  EVM_BLOCKCHAIN_NAME.BASE,
  EVM_BLOCKCHAIN_NAME.POLYGON
]

export default observer(function Providers(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const address = wallet?.accounts?.[0]?.address
  const provider = wallet?.provider
  const [cctpCalculating, setCctpCalculating] = useState(false)
  const [pathrCalculating, setPathrCalculating] = useState(false)
  
  const pathrStore = useStore('pathrStore')
  const inputStore = useStore('inputStore')
  const evmWalletStore = useStore('evmWalletStore')
  const displayStore = useStore('displayStore')
  const apiDataStore = useStore('apiDataStore')
  const cctpStore = useStore('cctpStore')
  const dialogStore = useStore('dialogStore')

  useEffect(()=>{
    pathrStore.setCalculating(cctpCalculating || pathrCalculating)
  }, [cctpCalculating, pathrCalculating])

  useEffect(()=>{
    if (
      !pathrStore.fromChainTokenAddr || !pathrStore.toChainTokenAddr
      || !isGreaterThanZero(inputStore.tokenAmout)
    ) return

    // same chain, or one of the chain is not cctp chain, use rubic
    console.log('pathrStore.fromChainName', pathrStore.fromChainName)
    console.log('pathrStore.toChainName', pathrStore.toChainName)
    if (
      true ||
      pathrStore.fromChainName===pathrStore.toChainName
      || !CCTP_CHAIN_NAMES.includes(pathrStore.fromChainName as any)
      || !CCTP_CHAIN_NAMES.includes(pathrStore.toChainName as any)
    ) {
      console.log('not cctp chain, using rubic')
      setPathrCalculating(true)
      // pathrStore.setCalculating(true)
      calcRouterPathr({pathrStore, inputStore, address, provider}).finally(()=>{ // need real Promise to kown if calc completed
        setPathrCalculating(false);
        // pathrStore.setCalculating(false)
      })
      // return
    }

    // source and target chain are cctp chain
    // source and target token is USDC or in the usdc pools
    // source and target chain are different
    if (
      CCTP_CHAIN_NAMES.includes(pathrStore.fromChainName as any) // source chain is cctp chain
      && CCTP_CHAIN_NAMES.includes(pathrStore.toChainName as any) // target chain is cctp chain
      && pathrStore.fromChainName!==pathrStore.toChainName // source and target chain are different
      && ( // source and target token is USDC or in the usdc pools
        CHAINS.find(chain=>chain.chainName===pathrStore.fromChainName)?.usdc.toLowerCase() === pathrStore.fromChainTokenAddr.toLowerCase()
        || CHAINS.find(chain=>chain.chainName===pathrStore.toChainName)?.usdc.toLowerCase() === pathrStore.toChainTokenAddr.toLowerCase()
        || tokensWithUsdcPools.find(token=>token.address.toLowerCase()===pathrStore.fromChainTokenAddr?.toLowerCase())
      )
    ) {
      const sourceChain = CHAINS.find(chain=>chain.chainName===pathrStore.fromChainName)
      if (!sourceChain) return
      const sourceToken = apiDataStore.coingeckoTokens.find((token)=>token.address.toLowerCase()===pathrStore?.fromChainTokenAddr?.toLowerCase())
      if (!sourceToken) return
      const tokenIn = new Token(sourceChain.chainId, pathrStore.fromChainTokenAddr, sourceToken.decimals, sourceToken.symbol)
      const targetChain = CHAINS.find(chain=>chain.chainName===pathrStore.toChainName)
      if (!targetChain) return
      const targetToken = apiDataStore.coingeckoTokens.find(token=>token.address.toLowerCase()===pathrStore?.toChainTokenAddr?.toLowerCase())
      if (!targetToken) return
      const tokenOut = new Token(targetChain.chainId, pathrStore.toChainTokenAddr, targetToken.decimals, targetToken.symbol)

      console.log({
        amountIn: inputStore.tokenAmout,
        tokenIn,
        tokenOut,
        apiDataStore
      })
      setCctpCalculating(true)
      // pathrStore.setCalculating(true)
      calcRouter({
        amountIn: inputStore.tokenAmout,
        tokenIn,
        tokenOut,
        apiDataStore
      }).then((result)=>{
        console.log('amountOut', result.amountOut)
        cctpStore.setSwapInfo({
          amountIn: inputStore.tokenAmout,
          tokenIn,
          tokenOut,
          amountOut: result.amountOut,
          fee: result.fee,
          slippage: result.slippage,
          targetFee: result.targetFee,
          timeSecond: result.timeSecond,
          timeUsed: result.timeUsed
        })
      }).catch(error=>{
        console.error('error calcRouter', error, error.message)
        dialogStore.showDialog({
          title: 'Error code 1610',
          content: error.message
        })
      })
      .finally(()=>{
        setCctpCalculating(false)
        // pathrStore.setCalculating(false)
      })
    }
  }, [ // should not input inputStore.tokenAmout here, otherwise it will recalc every time amount change
    pathrStore.routerCalcTime, pathrStore, inputStore, address, provider
  ])

  useEffect(()=>{
    pathrStore.setTrades([])
    displayStore.setShowProviders(false)
    cctpStore.setSwapInfo(null)
  }, [inputStore.tokenAmout, displayStore, pathrStore])

  return (
<div className={`max-w-[392px] w-full min-h-[100px] rounded-xl py-4 px-6 ${props.className}`} 
  style={{...props.style}}
>
  <div className="flex items-center mb-4">
    <div className="grow font-semibold text-xl">You get</div>
    {pathrStore.calculating&&<CircularProgress className="text-[8px]" color="success" />}
  </div>

  {pathrStore.calculating&& <div className="mb-4">Calculating Routes...</div>}

  {cctpStore.swapInfo&&<ProviderCCTP className="mb-4" />}

  {pathrStore.trades?.map((_, index)=>{
    if (0===index) {
      return <Provider providerIndex={index} key={`trade-${index}`} />
    }
    return <Provider providerIndex={index} className="mt-4" key={`trade-${index}`} />
  })}

</div>
  )
})