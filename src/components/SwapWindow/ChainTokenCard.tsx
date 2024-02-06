'use client'

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@nextui-org/react"
import ChainTokenIcon from "./ChainTokenIcon"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import allTokens from '@/configs/rubic/all-tokens.json'

export default observer(function ChainTokenCard(props: {
  onClick:(direction: 'from'|'to')=>void,
  direction: 'from'|'to'
}) {
  const {onClick, direction} = props

  const displayStore = useStore('displayStore')
  const rubicStore = useStore('rubicStore')
  const inputStore = useStore('inputStore')

  let tokenAddr = rubicStore.fromChainTokenAddr
  let chainName = rubicStore.fromChainName
  if (direction==='to') {
    tokenAddr = rubicStore.toChainTokenAddr
    chainName = rubicStore.toChainName
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
    {/* {tokenInfo?.symbol&&tokenAddr&&chainName&& */}
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
    {/* } */}
    {/* {!tokenInfo?.symbol&&<div>Please select chain and token</div>} */}
  </div>
</Button>
  )
})