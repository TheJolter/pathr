'use client'

import { useTheme } from "next-themes"
import { CSSProperties, useEffect, useState } from "react"
import MainButton from "./MainButton"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import { EVM_BLOCKCHAIN_NAME } from "pathr-sdk"
import { DEFAULT_TOKENS } from "@/configs/default"

export default observer(function Menu() {
  const { theme } = useTheme()
  const displayStore = useStore('displayStore')
  const selectedMenu = displayStore.selectedMenu
  const pathrStore = useStore('pathrStore')
  const inputStore = useStore('inputStore')
  const [menuBgStyle, setMenuBgStyle] = useState<CSSProperties>()
  const noneSelectedStyle = {background: 'rgba(0,0,0,0)', color: '#9FA8AB'}

  useEffect(()=>{
    if (selectedMenu==='bridge') {
      pathrStore.setFromChainName(DEFAULT_TOKENS.bridge.from.chainName)
      pathrStore.setToChainName(DEFAULT_TOKENS.bridge.to.chainName)
      pathrStore.setFromChainTokenAddr(DEFAULT_TOKENS.bridge.from.tokenAddress)
      pathrStore.setToChainTokenAddr(DEFAULT_TOKENS.bridge.to.tokenAddress)
      inputStore.setBridgeToken('USDC')
    } else if (selectedMenu==='swap') {
      pathrStore.setFromChainName(DEFAULT_TOKENS.swap.from.chainName)
      pathrStore.setToChainName(DEFAULT_TOKENS.swap.to.chainName)
      pathrStore.setFromChainTokenAddr(DEFAULT_TOKENS.swap.from.tokenAddress)
      pathrStore.setToChainTokenAddr(DEFAULT_TOKENS.swap.to.tokenAddress)
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

    {/* <MainButton className="h-[46px] font-semibold text-lg" fullWidth
      onClick={()=>{
        displayStore.setSelectedMenu('jolt')
      }}
      style={selectedMenu!=='jolt'?noneSelectedStyle:undefined}
    >JOLT</MainButton> */}

    <MainButton className="h-[46px] font-semibold text-lg" fullWidth
      onClick={()=>{
        // window.open('https://usdc.pathr.io')
        displayStore.setSelectedMenu('usdc')
      }}
      style={selectedMenu!=='usdc'?noneSelectedStyle:undefined}
      // style={noneSelectedStyle}
    >USDC</MainButton>
  </div>
  <div className="rounded-full absolute w-full h-[58px] top-0" 
    style={menuBgStyle}
  ></div>
</div>
</>)
})