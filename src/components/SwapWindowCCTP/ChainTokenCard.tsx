'use client'

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@nextui-org/react"
import ChainTokenIcon from "./ChainTokenIcon"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import allTokens from '@/configs/pathr/all-tokens.json'
import { ADDR0 } from "@/configs/pathr/tokens"
import { EVM_BLOCKCHAIN_NAME } from "pathr-sdk"

export const DEFAULT_TOKENS: { [key: string]: string } = {
  [EVM_BLOCKCHAIN_NAME.ETHEREUM]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [EVM_BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: ADDR0,
  [EVM_BLOCKCHAIN_NAME.POLYGON]: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  [EVM_BLOCKCHAIN_NAME.OPTIMISM]: '0x4200000000000000000000000000000000000006',
  [EVM_BLOCKCHAIN_NAME.ARBITRUM]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  [EVM_BLOCKCHAIN_NAME.GNOSIS]: '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1',
  [EVM_BLOCKCHAIN_NAME.AVALANCHE]: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
  [EVM_BLOCKCHAIN_NAME.FANTOM]: ADDR0,
  [EVM_BLOCKCHAIN_NAME.AURORA]: '0xc9bdeed33cd01541e1eed10f90519d2c06fe3feb',
  [EVM_BLOCKCHAIN_NAME.KLAYTN]: ADDR0,
  [EVM_BLOCKCHAIN_NAME.ZK_SYNC]: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
  [EVM_BLOCKCHAIN_NAME.BASE]: '0x4200000000000000000000000000000000000006'
}

export default observer(function ChainTokenCard(props: {
  onClick:(direction: 'from'|'to')=>void,
  direction: 'from'|'to'
}) {
  const {onClick, direction} = props

  const displayStore = useStore('displayStore')
  const pathrStore = useStore('pathrStore')
  const inputStore = useStore('inputStore')

  let tokenAddr = pathrStore.fromChainTokenAddr
  let chainName = pathrStore.fromChainName
  if (!tokenAddr && displayStore.selectedMenu!=='bridge') {
    tokenAddr = DEFAULT_TOKENS[chainName!]
    pathrStore.setFromChainTokenAddr(tokenAddr)
  }
  if (direction==='to' && displayStore.selectedMenu!=='bridge') {
    tokenAddr = pathrStore.toChainTokenAddr
    chainName = pathrStore.toChainName
    if (!tokenAddr) {
      tokenAddr = DEFAULT_TOKENS[chainName!]
      pathrStore.setToChainTokenAddr(tokenAddr)
    }
  }

  

  const { theme } = useTheme()

  const [background, setBackground] = useState('')

  const tokenInfo = allTokens.find(item=>{return item.address===tokenAddr && item.blockchainName===chainName})

  useEffect(()=>{
    if (theme==='dark') {
      setBackground('#354439')
      return
    }
    setBackground('#ffffff')
  }, [theme])

  return (
<Button className="h-[100px] rounded-xl border-[#35593F] border-1 p-0 m-0 text-left"
  style={{background}}
  onClick={()=>{
    if (pathrStore.calculating) return
    console.log('inputStore.isAmountInputFocus', inputStore.isAmountInputFocus)
    console.log(`navigator.userAgent.includes('Mobile')`, navigator.userAgent.includes('Mobile'))
    if (
      inputStore.isAmountInputFocus
      && navigator.userAgent.includes('Mobile')
    ) {
      return
    }
    onClick(direction)
  }}
>
  <div className="flex flex-col justify-between w-full p-4">
    <div className="font-bold capitalize">{direction}</div>
      <div className="flex items-center">
        <ChainTokenIcon chainName={chainName!} tokenAddr={tokenAddr!} />
        <div className="ml-4">
          <div>{tokenInfo?.symbol}</div>
          {tokenInfo?.blockchainName&&<div className="text-xs text-gray-400">On {tokenInfo?.blockchainName}</div>}
          {!tokenInfo?.blockchainName&&<div className="text-xs text-gray-400">
            Please select chain and token
          </div>}
        </div>
      </div>
  </div>
</Button>
  )
})