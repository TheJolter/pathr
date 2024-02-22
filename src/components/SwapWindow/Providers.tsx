'use client'

import { useEffect, useState } from "react"
import Provider from "./Provider"
import {CircularProgress} from "@nextui-org/react"
import { useStore } from "@/stores/hooks"
import { observer } from "mobx-react-lite"
import calcRouter from "@/utils/pathr/calcRouter"
import { useConnectWallet } from "@web3-onboard/react"

export default observer(function Providers(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const address = wallet?.accounts?.[0]?.address
  const provider = wallet?.provider
  
  const pathrStore = useStore('pathrStore')
  const inputStore = useStore('inputStore')
  const evmWalletStore = useStore('evmWalletStore')
  const displayStore = useStore('displayStore')
  // const [calculating, setCalculating] = useState(false)

  useEffect(()=>{
    // if (!provider) return
    calcRouter({pathrStore, inputStore, address, provider}).finally(()=>{ // need real Promise to kown if calc completed
      pathrStore.setCalculating(false);
    })
  }, [ // should not input inputStore.tokenAmout here, otherwise it will recalc every time amount change
    pathrStore.routerCalcTime, pathrStore, inputStore, address, provider
  ])

  useEffect(()=>{
    pathrStore.setTrades([])
    displayStore.setShowProviders(false)
  }, [inputStore.tokenAmout, displayStore, pathrStore])

  return (
<div className={`max-w-[392px] w-full min-h-[100px] rounded-xl py-4 px-6 ${props.className}`} 
  style={{...props.style}}
>
  <div className="flex items-center mb-4">
    <div className="grow font-semibold text-xl">You get</div>
    {pathrStore.calculating&&<CircularProgress className="text-[8px]" color="success" />}
  </div>

  {/* <Provider providerIndex={-1} isBest />
  <Provider providerIndex={-1} className="mt-4" /> */}

  {pathrStore.trades?.map((_, index)=>{
    if (0===index) {
      return <Provider providerIndex={index} isBest key={`trade-${index}`} />
    }
    return <Provider providerIndex={index} className="mt-4" key={`trade-${index}`} />
  })}

  {pathrStore.calculating&& <div>Calculating Routers...</div>}
</div>
  )
})