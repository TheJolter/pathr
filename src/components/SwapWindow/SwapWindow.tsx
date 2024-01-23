'use client'

import { useTheme } from "next-themes"
import {useEffect, useState, CSSProperties } from "react"
import Providers from "./Providers"
import Exchange from "./Exchange"
import { useStore } from "@/stores/hooks"
import { observer } from "mobx-react-lite"
import ChainTokenSelector from "./ChainTokenSelector/ChainTokenSelector"
import Review from "./Review/Review"
import SuccessDialog from "./SuccessDialog"
import WarningDialog from "./WarningDialog"
import bn from "@/utils/bn"

export default observer(function SwapWindow(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
  const { theme } = useTheme()
  const inputStore = useStore('inputStore')
  const displayStore = useStore('displayStore')
  const rubicStore = useStore('rubicStore')
  const evmWalletStore = useStore('evmWalletStore')

  const [boxBgStyle, setBoxBgStyle] = useState<CSSProperties>()

  useEffect(()=>{
    console.log('displayStore.showChainTokenSelector', displayStore.showChainTokenSelector)
  }, [displayStore.showChainTokenSelector])

  useEffect(()=>{
    if (bn(inputStore.tokenAmout||0).lte(0)) {
      displayStore.setShowProviders(false)
    }
    if (!inputStore.tokenAmout) {
      displayStore.setSelectedProvider(-1)
      displayStore.setShowChainTokenSelector(undefined)
    }
  }, [
    displayStore,
    inputStore.tokenAmout,
  ])

  useEffect(()=>{
    displayStore.setShowProviders(false)
    inputStore.setTokenAmount('')
  }, [
    displayStore,
    inputStore,
    rubicStore.fromChainTokenAddr, 
    rubicStore.toChainTokenAddr,
    rubicStore.fromChainName,
    rubicStore.toChainName,
  ])

  useEffect(()=>{
    displayStore.setShowPreview(false)
  }, [displayStore, evmWalletStore.address])

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
    
    <div className="flex justify-center"
      style={{display: (!displayStore.showChainTokenSelector && !displayStore.showReview)?undefined:'none' }}
    >
      <div className={`flex ${displayStore.showProviders?'justify-end':'justify-center'}`}>
        <Exchange style={boxBgStyle} />
      </div>
      
      <div className={`transform transition-transform duration-500 ease-in-out ${displayStore.showProviders ? "visible scale-100 ml-6" : "invisible scale-0 h-0 w-0"}`}>
        <Providers style={boxBgStyle} />
      </div>
    </div>
    
    <ChainTokenSelector style={{...boxBgStyle,
      display: (displayStore.showChainTokenSelector && !displayStore.showReview)?undefined:'none'
    }} />

    { displayStore.showReview &&
      <Review style={boxBgStyle} />
    }

    <SuccessDialog />

    <WarningDialog />
  </div>
</div>
)
})