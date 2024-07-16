'use client'

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@nextui-org/react"
import { observer } from "mobx-react-lite"
import ChainTokenIcon from "./ChainTokenIcon"
import { JOLT_CHAIN_IMGS, JOLTChain } from "./JOLTBridge"

export default observer(function ChainTokenCard(props: {
  joltChain: JOLTChain, direction: string
}) {
  const {joltChain, direction} = props

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
>
  <div className="flex flex-col justify-between w-full p-4">
    <div className="font-bold capitalize">{direction}</div>
      <div className="flex items-center">
        <ChainTokenIcon 
          tokenImg="https://joltify.io/wp-content/uploads/2023/09/joltify-02.png"
          chainImg={JOLT_CHAIN_IMGS[joltChain]}
        />
        <div className="ml-4">
          <div>JOLT</div>
          <div className="text-xs text-gray-400">On {joltChain.toUpperCase()}</div>
        </div>
      </div>
  </div>
</Button>
  )
})