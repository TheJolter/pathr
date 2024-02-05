import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "@nextui-org/react"
import { CSSProperties, useEffect, useState } from "react"
import ToggleButton from "./ToggleButton"
import ChainTokenCard from "./ChainTokenCard"
import InputCard from "./InputCard"
import MainButton from "../MainButton"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import bn from "@/utils/bn"

export default observer(function Exchange(props: {
  style?: CSSProperties
}) {

  const displayStore = useStore('displayStore')
  const rubicStore = useStore('rubicStore')
  const inputStore = useStore('inputStore')

  function handleToggle() {
    const _fromChainName = rubicStore.fromChainName
    const _fromChainTokenAddr = rubicStore.fromChainTokenAddr
    rubicStore.setFromChainName(rubicStore.toChainName)
    rubicStore.setFromChainTokenAddr(rubicStore.toChainTokenAddr)
    rubicStore.setToChainName(_fromChainName)
    rubicStore.setToChainTokenAddr(_fromChainTokenAddr)
  }

  return (
<div 
  className={`w-full flex ${displayStore.showProviders?'justify-center md:justify-end':'justify-center'}`}
>
  <div className="w-full max-w-[392px]">
    <div style={props.style}
      className="max-w-[392px] w-full rounded-xl px-6 py-4" 
    >
      <div className="flex items-center">
        <div className="font-semibold text-2xl grow">Exchange</div>
        {/* <Button isIconOnly className="bg-opacity" size="md" radius="full">
          <FontAwesomeIcon icon={faArrowsRotate} spin size="lg" />
        </Button> */}
        {/* <Button isIconOnly className="bg-opacity" size="md" radius="full">
          <FontAwesomeIcon icon={faBars} size="lg" />
        </Button> */}
      </div>

      <div className="relative w-full">
        <div className="absolute z-10 text-center w-full top-[88px] pointer-events-none">
          <ToggleButton onClick={handleToggle} />
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <ChainTokenCard direction="from" onClick={()=>{displayStore.setShowChainTokenSelector('from')}} />
          <ChainTokenCard direction="to" onClick={()=>displayStore.setShowChainTokenSelector('to')} />
        </div>
      </div>

      <InputCard className="mt-4 p-4" />

      {/* {rubicStore.fromChainTokenAddr && rubicStore.toChainTokenAddr && bn(inputStore.tokenAmout||0).gt(0) && */}
        <MainButton fullWidth className="mt-4"
          disabled={rubicStore.calculating}
          onClick={()=>{
            if (! ( rubicStore.fromChainTokenAddr && rubicStore.toChainTokenAddr && bn(inputStore.tokenAmout||0).gt(0) ) ) {
              return
            }
            rubicStore.updateRouterCalcTime()
            displayStore.setShowProviders(true)
          }}
        >Calculate Routers</MainButton>
      {/* } */}
      
    </div>
  </div>
</div>
  )
})