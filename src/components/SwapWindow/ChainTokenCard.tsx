'use client'

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@nextui-org/react"
import ChainTokenIcon from "./ChainTokenIcon"

export default function ChainTokenCard() {
  const { theme } = useTheme()

  const [background, setBackground] = useState('')

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
  onClick={()=>console.log('ChainTokenCard clicked')}
>
  <div className="flex flex-col justify-between">
    <div className="font-bold">From</div>
    <div className="flex items-center">
      <ChainTokenIcon />
      <div className="ml-4">
        <div>ETH</div>
        <div className="text-xs text-gray-400">On Ethereum</div>
      </div>
    </div>
  </div>
</Button>
  )
}