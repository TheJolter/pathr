'use client'

import { useTheme } from "next-themes"
import { CSSProperties, useEffect, useState } from "react"
import MainButton from "./MainButton"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"

export default observer(function Menu() {
  const { theme } = useTheme()
  const displayStore = useStore('displayStore')
  const selectedMenu = displayStore.selectedMenu
  const rubicStore = useStore('rubicStore')
  const [menuBgStyle, setMenuBgStyle] = useState<CSSProperties>()
  const noneSelectedStyle = {background: 'rgba(0,0,0,0)', color: '#9FA8AB'}

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
<div className="relative">
  <div className="relative z-10 px-[6px] flex items-center h-[58px]">
    <MainButton className="h-[46px] font-semibold text-lg" fullWidth
      onClick={()=>displayStore.setSelectedMenu('swap')}
      style={selectedMenu!=='swap'?noneSelectedStyle:undefined}
    >Swap</MainButton>
    <MainButton className="h-[46px] font-semibold text-lg" fullWidth
      onClick={()=>{
        rubicStore.setToChainTokenAddr(null)
        displayStore.setShowPreview(false)
        displayStore.setSelectedMenu('gas')
      }}
      style={selectedMenu!=='gas'?noneSelectedStyle:undefined}
    >Gas</MainButton>
  </div>
  <div className="rounded-full absolute w-full h-[58px] top-0" 
    style={menuBgStyle}
  ></div>
</div>
</>)
})