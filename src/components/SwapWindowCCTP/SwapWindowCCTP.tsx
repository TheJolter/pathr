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
import { useConnectWallet } from "@web3-onboard/react"
import { getAndStorePlatformFees } from "@/utils/cctp/get-and-store-platform-fee"
import ReviewPathr from "./ReviewPathr/Review"

export default observer(function SwapWindow(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const address = wallet?.accounts?.[0]?.address
  
  const { theme } = useTheme()
  const inputStore = useStore('inputStore')
  const displayStore = useStore('displayStore')
  const pathrStore = useStore('pathrStore')
  const cctpStore = useStore('cctpStore')
  const dialogStore = useStore('dialogStore')
  const apiDataStore = useStore('apiDataStore')
  const [targetTxHash, setTargetTxHash] = useState<string>()

  const [boxBgStyle, setBoxBgStyle] = useState<CSSProperties>()

  // console.log('displayStore.showProviders', displayStore.showProviders)
  // console.log('pathrStore.routerCalcTime', pathrStore.routerCalcTime)

  useEffect(()=>{
    getAndStorePlatformFees({apiDataStore})
  }, [])

  useEffect(()=>{
    console.log('displayStore.showChainTokenSelector', displayStore.showChainTokenSelector)
  }, [displayStore.showChainTokenSelector])

  useEffect(()=>{
    if (bn(inputStore.tokenAmout||0).lte(0)) {
      displayStore.setShowProviders(false)
      cctpStore.setSwapInfo(null)
    }
    if (!inputStore.tokenAmout) {
      displayStore.setSelectedProvider(-1)
      // displayStore.setShowChainTokenSelector(undefined)
    }
  }, [
    displayStore,
    inputStore.tokenAmout,
  ])

  useEffect(()=>{
    displayStore.setShowProviders(false)
    inputStore.setTokenAmount('')
    cctpStore.setSwapInfo(null)
  }, [
    displayStore,
    inputStore,
    pathrStore.fromChainTokenAddr, 
    pathrStore.toChainTokenAddr,
    pathrStore.fromChainName,
    pathrStore.toChainName,
  ])

  useEffect(()=>{
    displayStore.setShowPreviewRubic(false)
    displayStore.setShowPreview(false)
    cctpStore.setSwapInfo(null)
  }, [displayStore, address])

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
<div className="w-full relative z-10">
  <div {...props}
    // className={`grid gap-6 ${showProvider?'grid-cols-2':'grid-cols-1'} ${props.className}`}
    className={`${props.className} flex justify-center w-full`}
  >
    
    <div 
      className={`grid grid-cols-1 gap-5 mx-2 w-full
        ${displayStore.showProviders?`md:grid-cols-2`:`md:grid-cols-1`}
      `}
      style={{display: (!displayStore.showChainTokenSelector && !displayStore.showReview && !displayStore.showReviewRubic)?undefined:'none' }}
    >
      <div id='container-of-exchange' className={`flex ${displayStore.showProviders?'justify-end':'justify-center'} w-full`}>
        <Exchange style={boxBgStyle} />
      </div>
      
      <div className={`transform transition-transform duration-500 ease-in-out ${displayStore.showProviders ? "visible scale-100" : "invisible scale-0 h-0 w-0"}
        flex md:block justify-center
      `}>
        <Providers style={boxBgStyle} />
      </div>
    </div>
    
    <ChainTokenSelector style={{...boxBgStyle,
      display: (displayStore.showChainTokenSelector && !displayStore.showReview && !displayStore.showReviewRubic)?undefined:'none'
    }} />

    { displayStore.showReview &&
      <Review style={boxBgStyle} />
    }

    { displayStore.showReviewRubic &&
      <ReviewPathr style={boxBgStyle} />
    }

    <SuccessDialog />

    <WarningDialog />
  </div>

  {/* <Button onClick={()=>{
    dialogStore.showDialog({
      forbidClose: true,
      title: 'Do not close this dialog',
      content: <ProgressDialogContent 
      sourceTxHash='0x66f39329afca97c3e2a4f0bc995ff06df28c54fb5fe95cb2e7ac139ca39e38cb' 
    />,
    })
  }}>Dialog Test</Button> */}
</div>
)
})