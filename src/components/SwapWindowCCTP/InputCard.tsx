'use client'

import { useTheme } from "next-themes"
import { CSSProperties, useEffect, useState } from "react"
import ChainTokenIcon from "./ChainTokenIcon"
import { Chip } from "@nextui-org/react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import { BlockchainInfo } from "@/configs/pathr/blockchain-info"
import allTokens from '@/configs/pathr/all-tokens.json'
import getAndSotreBalance from "@/utils/get-and-store-balance"
import { bigNumberFloor } from "@/utils/bigNumberCeilFloor"
import bn from "@/utils/bn"

import { useConnectWallet } from '@web3-onboard/react'
import { DEFAULT_TOKENS } from "./ChainTokenCard"

export default observer(function InputCard(props: {
  style?: CSSProperties,
  className?: string
}) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const address = wallet?.accounts?.[0]?.address

  const { theme } = useTheme()
  const inputStore = useStore('inputStore')
  const pathrStore = useStore('pathrStore')
  // const evmWalletStore = useStore('evmWalletStore')
  const balanceStore = useStore('balanceStore')

  const [background, setBackground] = useState('')
  const [balanceKey, setBalanceKey] = useState('')

  let fromChainTokenAddr = pathrStore.fromChainTokenAddr

  useEffect(()=>{
    if (theme==='dark') {
      setBackground('#354439')
      return
    }
    setBackground('#ffffff')
  }, [theme])

  useEffect(()=>{
    setBalanceKey('')
    // console.log({fromChainName, fromTokenName, account: address})
    const chainId = BlockchainInfo[pathrStore.fromChainName||'']?.id
    const fromToken = allTokens.find(item=>{return item.address===fromChainTokenAddr && item.blockchainName===pathrStore.fromChainName})
    if (!fromToken || !address) return
    getAndSotreBalance({
      balanceStore,
      chainId,
      tokenAddress: fromToken.address,
      account: address,
      getBakanceKey: (_balanceKey: string) => {
        setBalanceKey(_balanceKey)
      }
    })
  }, [pathrStore.fromChainName, fromChainTokenAddr, address, balanceStore])

  function handleMaxClick() {
    if (pathrStore.calculating) return
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
      <ChainTokenIcon chainName={pathrStore.fromChainName!} tokenAddr={fromChainTokenAddr!} />
    </div>
    <div className=" ml-4">
      <div className="flex items-center mb-1">
        <input placeholder="0" value={inputStore.tokenAmout} disabled={pathrStore.calculating}
          className="text-lg font-semibold mr-3 bg-transparent focus:outline-none border-none w-full"
          onChange={(e)=>{
            if (! /^\d?(\d+[\.]?\d*)?$/.test(e.target.value) ) return
            inputStore.setTokenAmount(e.target.value)
          }}
          onBlur={()=>{
            setTimeout(()=>{
              inputStore.setIsAmountInputFocus(false)
            }, 100)
          }}
          onFocus={()=>inputStore.setIsAmountInputFocus(true)}
        />
        <Chip size="sm" color="success" className="cursor-pointer"
          onClick={handleMaxClick}
        >Max</Chip>
      </div>
      <div className="items-center justify-between text-xs text-gray-400">
        {/* <div>$123.45</div> */}
        {address&&<div
          style={{color: bn(balanceStore.balances[balanceKey]?.amount||0).lt(inputStore.tokenAmout)?'red':undefined}}
        >
          Balance: {bigNumberFloor(balanceStore.balances[balanceKey]?.amount||0 ,6).toFormat()}
        </div>}
      </div>
    </div>
  </div>
</div>
  )
})