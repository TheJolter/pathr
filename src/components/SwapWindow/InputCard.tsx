'use client'

import { useTheme } from "next-themes"
import { CSSProperties, useEffect, useState } from "react"
import ChainTokenIcon from "./ChainTokenIcon"
import { Chip } from "@nextui-org/react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import { BlockchainInfo } from "@/configs/rubic/blockchain-info"
import allTokens from '@/configs/rubic/all-tokens.json'
import getAndSotreBalance from "@/utils/get-and-store-balance"
import { bigNumberFloor } from "@/utils/bigNumberCeilFloor"
import bn from "@/utils/bn"

export default observer(function InputCard(props: {
  style?: CSSProperties,
  className?: string
}) {
  const { theme } = useTheme()
  const inputStore = useStore('inputStore')
  const rubicStore = useStore('rubicStore')
  const evmWalletStore = useStore('evmWalletStore')
  const balanceStore = useStore('balanceStore')

  const [background, setBackground] = useState('')
  const [balanceKey, setBalanceKey] = useState('')

  useEffect(()=>{
    if (theme==='dark') {
      setBackground('#354439')
      return
    }
    setBackground('#ffffff')
  }, [theme])

  useEffect(()=>{
    setBalanceKey('')
    // console.log({fromChainName, fromTokenName, account: evmWalletStore.address})
    const chainId = BlockchainInfo[rubicStore.fromChainName||'']?.id
    const fromToken = allTokens.find(item=>{return item.address===rubicStore.fromChainTokenAddr && item.blockchainName===rubicStore.fromChainName})
    if (!fromToken || !evmWalletStore.address) return
    getAndSotreBalance({
      balanceStore,
      chainId,
      tokenAddress: fromToken.address,
      account: evmWalletStore.address,
      getBakanceKey: (_balanceKey: string) => {
        setBalanceKey(_balanceKey)
      }
    })
  }, [rubicStore.fromChainName, rubicStore.fromChainTokenAddr, evmWalletStore.address, balanceStore])

  if (!rubicStore.fromChainName||!rubicStore.fromChainTokenAddr) return <></>

  function handleMaxClick() {
    const balancesInfo = balanceStore.balances[balanceKey]
    if (balancesInfo) {
      inputStore.setTokenAmount(bigNumberFloor(balancesInfo.amount, balancesInfo.decimals).toFixed())
    }
  }

  return (
<div style={{background, ...props.style}} 
  className={`h-[100px] rounded-xl border-[#35593F] border-1 ${props.className}
    flex flex-col justify-center
  `}
>
  <div className="font-semibold mb-2">You pay</div>
  <div id="input-card-icon-input-amout" className="flex">
    <div>
      <ChainTokenIcon chainName={rubicStore.fromChainName} tokenAddr={rubicStore.fromChainTokenAddr} />
    </div>
    <div className=" ml-4">
      <div className="flex items-center mb-1">
        <input placeholder="0" value={inputStore.tokenAmout}
          className="text-lg font-semibold mr-3 bg-transparent focus:outline-none border-none w-full"
          onChange={(e)=>{
            if (! /^\d?(\d+[\.]?\d*)?$/.test(e.target.value) ) return
            inputStore.setTokenAmount(e.target.value)
          }}
        />
        <Chip size="sm" color="success" className="cursor-pointer"
          onClick={handleMaxClick}
        >Max</Chip>
      </div>
      <div className="items-center justify-between text-xs text-gray-400">
        {/* <div>$123.45</div> */}
        {evmWalletStore.address&&<div
          style={{color: bn(balanceStore.balances[balanceKey]?.amount||0).lt(inputStore.tokenAmout)?'red':undefined}}
        >
          / {bigNumberFloor(balanceStore.balances[balanceKey]?.amount||0 ,6).toFormat()}
        </div>}
      </div>
    </div>
  </div>
</div>
  )
})