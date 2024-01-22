'use client'

import { useTheme } from "next-themes"
import { CSSProperties, useEffect, useState } from "react"
import ChainTokenIcon from "./ChainTokenIcon"
import { Chip } from "@nextui-org/react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"

export default observer(function InputCard(props: {
  style?: CSSProperties,
  className?: string
}) {
  const { theme } = useTheme()
  const inputStore = useStore('inputStore')
  const rubicStore = useStore('rubicStore')

  const [background, setBackground] = useState('')

  useEffect(()=>{
    if (theme==='dark') {
      setBackground('#354439')
      return
    }
    setBackground('#ffffff')
  }, [theme])

  if (!rubicStore.fromChainName||!rubicStore.fromChainTokenAddr) return <></>
  return (
<div style={{background, ...props.style}} 
  className={`h-[100px] rounded-xl border-[#35593F] border-1 ${props.className}
    flex flex-col justify-center
  `}
>
  <div className="font-semibold mb-2">You pay</div>
  <div id="input-card-icon-input-amout" className="flex">
    <div><ChainTokenIcon chainName={rubicStore.fromChainName} tokenAddr={rubicStore.fromChainTokenAddr} /></div>
    <div className="grow ml-4">
      <div className="flex items-center mb-1">
        <input placeholder="0" value={inputStore.tokenAmout}
          className="grow text-lg font-semibold mr-3 bg-transparent focus:outline-none border-none"
          onChange={(e)=>{
            if (! /^\d?(\d+[\.]?\d*)?$/.test(e.target.value) ) return
            inputStore.setTokenAmount(e.target.value)
          }}
        />
        <Chip size="sm" color="success" className="cursor-pointer">Max</Chip>
      </div>
      <div className="items-center justify-between text-xs text-gray-400">
        <div>$123.45</div>
        <div>/ 123.45</div>
      </div>
    </div>
  </div>
</div>
  )
})