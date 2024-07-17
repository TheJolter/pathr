'use client'

import { useTheme } from "next-themes"
import { CSSProperties, useEffect, useState } from "react"
import MainButton from "./MainButton"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import { EVM_BLOCKCHAIN_NAME } from "pathr-sdk"

export default observer(function Menu() {
  const { theme } = useTheme()
  const displayStore = useStore('displayStore')
  const selectedMenu = displayStore.selectedMenu
  const pathrStore = useStore('pathrStore')
  const [menuBgStyle, setMenuBgStyle] = useState<CSSProperties>()
  const noneSelectedStyle = {background: 'rgba(0,0,0,0)', color: '#9FA8AB'}

  useEffect(()=>{
    if (selectedMenu==='bridge') {
      pathrStore.setFromChainName(EVM_BLOCKCHAIN_NAME.ARBITRUM)
      pathrStore.setToChainName(EVM_BLOCKCHAIN_NAME.BASE)
      pathrStore.setFromChainTokenAddr('0xaf88d065e77c8cC2239327C5EDb3A432268e5831'.toLowerCase())
      pathrStore.setToChainTokenAddr('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'.toLowerCase())
    }
  }, [selectedMenu])

  useEffect(()=>{
    if (theme==='dark') {
      setMenuBgStyle({
        background: 'linear-gradient(90deg, #32CA62 0%, #EAF83F 100%)', 
        opacity: 0.06
      })
      return
    }
    setMenuBgStyle({
      background: 'linear-gradient(90deg, #0A5020 0%, #353808 100%)', 
      opacity: 0.06
    })
  }, [theme])
  return (<>
<div id="menu-buttons" className="relative min-w-[300px]">
  <div className="relative z-10 px-[6px] flex items-center h-[58px]">
    <MainButton className="h-[46px] font-semibold text-lg" fullWidth
      onClick={()=>displayStore.setSelectedMenu('swap')}
      style={selectedMenu!=='swap'?noneSelectedStyle:undefined}
      // style={noneSelectedStyle}
    >Swap</MainButton>
    
    <MainButton className="h-[46px] font-semibold text-lg" fullWidth
      onClick={()=>{
        displayStore.setSelectedMenu('bridge')
      }}
      style={selectedMenu!=='bridge'?noneSelectedStyle:undefined}
    >Bridge</MainButton>

    <MainButton className="h-[46px] font-semibold text-lg" fullWidth
      onClick={()=>{
        displayStore.setSelectedMenu('jolt')
      }}
      style={selectedMenu!=='jolt'?noneSelectedStyle:undefined}
    >JOLT</MainButton>

    <MainButton className="h-[46px] font-semibold text-lg" fullWidth
      onClick={()=>{
        window.open('https://usdc.pathr.io')
      }}
      // style={selectedMenu!=='swap'?noneSelectedStyle:undefined}
      style={noneSelectedStyle}
    >USDC</MainButton>
  </div>
  <div className="rounded-full absolute w-full h-[58px] top-0" 
    style={menuBgStyle}
  ></div>
</div>
</>)
})