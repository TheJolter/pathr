'use client'

import { useEffect, useState } from "react"
import Provider from "./Provider"
import {CircularProgress} from "@nextui-org/react"
import { useStore } from "@/stores/hooks"
import { observer } from "mobx-react-lite"
import calcRouter from "@/utils/rubic/calcRouter"
import { useConnectWallet } from "@web3-onboard/react"

export default observer(function Providers(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const address = wallet?.accounts?.[0]?.address
  const provider = wallet?.provider
  
  const rubicStore = useStore('rubicStore')
  const inputStore = useStore('inputStore')
  const evmWalletStore = useStore('evmWalletStore')
  const displayStore = useStore('displayStore')
  // const [calculating, setCalculating] = useState(false)

  useEffect(()=>{
    // if (!provider) return
    calcRouter({rubicStore, inputStore, address, provider}).finally(()=>{ // need real Promise to kown if calc completed
      rubicStore.setCalculating(false);
    })
  }, [ // should not input inputStore.tokenAmout here, otherwise it will recalc every time amount change
    rubicStore.routerCalcTime, rubicStore, inputStore, address, provider
  ])

  useEffect(()=>{
    rubicStore.setTrades([])
    displayStore.setShowProviders(false)
  }, [inputStore.tokenAmout, displayStore, rubicStore])

  return (
<div className={`max-w-[392px] w-full min-h-[100px] rounded-xl py-4 px-6 ${props.className}`} 
  style={{...props.style}}
>
  <div className="flex items-center mb-4">
    <div className="grow font-semibold text-xl">You get</div>
    {rubicStore.calculating&&<CircularProgress className="text-[8px]" color="success" />}
  </div>

  {/* <Provider providerIndex={-1} isBest />
  <Provider providerIndex={-1} className="mt-4" /> */}

  {rubicStore.trades?.map((_, index)=>{
    if (0===index) {
      return <Provider providerIndex={index} isBest key={`trade-${index}`} />
    }
    return <Provider providerIndex={index} className="mt-4" key={`trade-${index}`} />
  })}

  {rubicStore.calculating&& <div>Calculating Routers...</div>}
</div>
  )
})