'use client'

import { useTheme } from "next-themes"
import {useEffect, useState, CSSProperties } from "react"
import Providers from "./Providers"
import Exchange from "./Exchange"
import { useStore } from "@/stores/hooks"
import { observer } from "mobx-react-lite"

export default observer(function SwapWindow(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
  const { theme } = useTheme()
  const inputStore = useStore('inputStore')

  const [boxBgStyle, setBoxBgStyle] = useState<CSSProperties>()
  const [showProvider, setShowProvider] = useState(false)
  const [showChainTokenSelector, setShowChainTokenSelector] = useState<'from'|'to'>()

  useEffect(()=>{
    setShowProvider(!!inputStore.tokenAmout)
  }, [inputStore.tokenAmout])

  useEffect(()=>{
    if (theme==='dark') {
      setBoxBgStyle({background: '#1E2D23'})
      return
    }
    setBoxBgStyle({
      background: '#F6F6F6', 
      boxShadow: '0px 2px 10px 0px rgba(0,0,0,0.1)',
    })
  }, [theme])

  return (
<div>
  <div {...props}
    // className={`grid gap-6 ${showProvider?'grid-cols-2':'grid-cols-1'} ${props.className}`}
    className={`${props.className} flex justify-center`}
  >
    {!showChainTokenSelector&&<>
      <div className={`flex ${showProvider?'justify-end':'justify-center'}`}>
        <Exchange style={boxBgStyle} />
      </div>
      
      <div className={`transform transition-transform duration-500 ease-in-out ${showProvider ? "visible scale-100 ml-6" : "invisible scale-0 h-0 w-0"}`}>
        <Providers style={boxBgStyle} />
      </div>
    </>}
  </div>
</div>
)
})