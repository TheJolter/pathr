'use client'

import { Avatar, Chip, Tooltip } from "@nextui-org/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import ChainTokenIcon from "./ChainTokenIcon"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faSackDollar } from '@fortawesome/free-solid-svg-icons'
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import { OnChainTrade, WrappedCrossChainTrade } from "pathr-sdk"
import bn from "@/utils/bn"
import allTokens from '@/configs/pathr/all-tokens.json'
import { ADDR0 } from "@/configs/pathr/tokens"
import { bigNumberCeil } from "@/utils/bigNumberCeilFloor"

export default observer(function Provider(props: {
  className?: string,
  isBest?: boolean,
  selected?: boolean,
  providerIndex: number
}) {
  const {className, isBest, selected, providerIndex} = props

  const displayStore = useStore('displayStore')
  const pathrStore = useStore('pathrStore')

  const toNativeToken = allTokens.find(item=>{return item.address===ADDR0 && item.blockchainName===pathrStore.toChainName})
  const fromNativeToken = allTokens.find(item=>{return item.address===ADDR0 && item.blockchainName===pathrStore.fromChainName})

  // let trade: OnChainTrade|WrappedCrossChainTrade
  let trade:any = pathrStore.trades?.[providerIndex]
  // if (pathrStore.fromChainName !== pathrStore.toChainName) {
  //   trade = pathrStore.trades[providerIndex] as WrappedCrossChainTrade
  // }
  let tradeType: string = (trade as OnChainTrade).type
  let onChain = true
  if (pathrStore.fromChainName !== pathrStore.toChainName) {
    onChain = false
    tradeType = (trade as WrappedCrossChainTrade).tradeType
    trade = trade.trade
  }
  

  const { theme } = useTheme()

  const [background, setBackground] = useState('')

  useEffect(()=>{
    if (theme==='dark') {
      setBackground('#354439')
      return
    }
    setBackground('#ffffff')
  }, [theme])

  if (tradeType==='LIFI') return <></> // lifi always failed?
  
  return (
<div style={{background}}
  className={`min-h-[64px] rounded-xl border-[#35593F] border-1 p-4 ${className} cursor-pointer`}
  onClick={()=>{
    displayStore.setSelectedProvider(providerIndex)
    displayStore.setShowPreviewRubic(true)
  }}
>
  {isBest&&<Chip size="sm" className="mb-3" color="success">Best</Chip>}

  {selected&&<div className="font-semibold mb-2">You get</div>}

  <div className="flex items-center justify-between">
    <ChainTokenIcon tokenAddr={pathrStore.toChainTokenAddr!} chainName={pathrStore.toChainName!} />
    <div className="grow ml-4">
      <div className="text-lg font-semibold">
        {/* 100 JOLT */}
        { bn(trade?.to?.weiAmount.toString()||0).div(bn(10).pow(trade?.to?.decimals||0)).toFormat(6)} {trade?.to?.symbol}
      </div>
      <div className="flex items-center text-gray-400 text-sm">
        {/* <div className="mr-1">$123.45</div>
        <div className="mr-1">·</div> */}
        <Avatar className="w-4 h-4 mr-1" name={tradeType?.[0]?.toUpperCase()} />
        <div>
          {tradeType}
          {/* Pancake */}
        </div>
      </div>
    </div>
    {/* <Button isIconOnly className="rounded-full" size="sm">
      <FontAwesomeIcon icon={faAngleDown} />
    </Button> */}
  </div>
  <div className="flex items-center justify-between mt-4">
    <div className="flex items-center mr-4">
      <Tooltip content="Protocol Fee" showArrow>
        <FontAwesomeIcon icon={faSackDollar} className="text-gray-400 mr-2" />
      </Tooltip>
      <div className="text-gray-400">
        { bigNumberCeil(trade?.feeInfo?.pathrProxy?.fixedFee?.amount?.toString()||0, 6).toFormat()} {fromNativeToken?.symbol}
      </div>
    </div>
    {/* {trade?.feeInfo?.provider&&<div className="flex items-center">
      <FontAwesomeIcon icon={faSackDollar} className="text-gray-400 mr-2" />
      <div>
        { bigNumberCeil(trade?.feeInfo?.provider?.cryptoFee?.amount?.toString()||0, 6).toFormat()} {toNativeToken?.symbol}
      </div>
    </div>} */}
    <div className="flex items-center grow justify-end">
      <FontAwesomeIcon icon={faClock} className="text-gray-400 mr-2" />
      <div>{onChain?'<1m':'≈3m'}</div>
    </div>
  </div>
</div>
  )
})