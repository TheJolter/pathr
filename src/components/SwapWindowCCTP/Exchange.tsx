import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Avatar, Button } from "@nextui-org/react"
import { CSSProperties, useEffect, useState } from "react"
import ToggleButton from "./ToggleButton"
import ChainTokenCard from "./ChainTokenCard"
import InputCard from "./InputCard"
import MainButton from "../MainButton"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import bn from "@/utils/bn"
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import allTokens from "@/configs/pathr/all-tokens.json"
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useTheme } from "next-themes"
import BRIDGE_TOKENS from "@/configs/bridge-tokens"
import { BlockchainInfo } from "@/configs/pathr/blockchain-info"

export default observer(function Exchange(props: {
  style?: CSSProperties
}) {

  const displayStore = useStore('displayStore')
  const pathrStore = useStore('pathrStore')
  const inputStore = useStore('inputStore')

  const { theme } = useTheme()

  const [bridgeTokenImg, setBridgeTokenImg] = useState<string|undefined>(undefined)
  const [background, setBackground] = useState('')

  // useEffect(()=>{
  //   setBlockchainNames(BRIDGE_TOKENS.find(item=>item.symbol===inputStore.bridgeToken)?.blockchainNames||[])
  // }, [inputStore.bridgeToken])

  useEffect(()=>{
    if (theme==='dark') {
      setBackground('#354439')
      return
    }
    setBackground('#ffffff')
  }, [theme])

  useEffect(()=>{
    setBridgeTokenImg(allTokens.find(item=>item.symbol===inputStore.bridgeToken)?.image)
  }, [inputStore.bridgeToken])

  function handleToggle() {
    const _fromChainName = pathrStore.fromChainName
    const _fromChainTokenAddr = pathrStore.fromChainTokenAddr
    pathrStore.setFromChainName(pathrStore.toChainName)
    pathrStore.setFromChainTokenAddr(pathrStore.toChainTokenAddr)
    pathrStore.setToChainName(_fromChainName)
    pathrStore.setToChainTokenAddr(_fromChainTokenAddr)
  }

  const CustomAutocomplete = styled(Autocomplete)`
    .bg-default-100 {
      background-color: ${background};
    }
  `;

  return (
<div 
  className={`w-full flex ${displayStore.showProviders?'justify-center md:justify-end':'justify-center'}`}
>
  <div className="w-full max-w-[392px]">
    <div style={props.style}
      className="max-w-[392px] w-full rounded-xl px-6 py-4" 
    >
      <div className="flex items-center">
        <div className="font-semibold text-2xl grow capitalize">
          {displayStore.selectedMenu}
        </div>
        {/* <Button isIconOnly className="bg-opacity" size="md" radius="full">
          <FontAwesomeIcon icon={faArrowsRotate} spin size="lg" />
        </Button> */}
        {/* <Button isIconOnly className="bg-opacity" size="md" radius="full">
          <FontAwesomeIcon icon={faBars} size="lg" />
        </Button> */}
      </div>

      {displayStore.selectedMenu==='bridge'&&<>
        <CustomAutocomplete
          className="mt-3 border-[#35593F] border-1 rounded-xl"
          label="Token"
          placeholder="Search an token"
          inputValue={inputStore.bridgeToken}
          defaultItems={BRIDGE_TOKENS}
          onSelectionChange={(token) => {
            console.log('token', token)
            inputStore.setBridgeToken(token as string)
            pathrStore.resetChainToken()
          }}
          startContent={bridgeTokenImg&&
          <img className="w-5 h-5 rounded-full"
            src={bridgeTokenImg} />
          }
          isClearable={false}
        >
          {(token) => <AutocompleteItem key={(token as any).symbol}
            startContent={
              <Avatar className="w-5 h-5" src={(token as any).img} />
            }
          >{(token as any).symbol}</AutocompleteItem>}
        </CustomAutocomplete>

        <div className="grid grid-cols-[1fr_auto_1fr] mt-4">
          <CustomAutocomplete
            className="border-[#35593F] border-1 rounded-xl"
            label="Source Chain"
            placeholder="select chain"
            inputValue={pathrStore.fromChainName??''}
            items={
              BRIDGE_TOKENS.find(item=>item.symbol.toLowerCase()===inputStore.bridgeToken?.toLowerCase())?.chains?.filter(item=>item.blockchainName!==pathrStore.toChainName)
              ||[]
            }
            onSelectionChange={(blockchainName) => {
              pathrStore.setFromChainName(blockchainName as string)
              pathrStore.setFromChainTokenAddr(allTokens.find(item=>(
                item.symbol===inputStore.bridgeToken
                && item.blockchainName===blockchainName
              ))?.address??null)
            }}
            isClearable={false}
          >
            {(chain) => {
              return <AutocompleteItem key={(chain as any).blockchainName} className="text text-xs"
              >{(chain as any).blockchainName}</AutocompleteItem>
            }}
          </CustomAutocomplete>

          <div className="flex items-center px-2 rotate-90">
            <ToggleButton onClick={()=>{
              if (pathrStore.calculating) return
              handleToggle()
            }} />
          </div>

          <CustomAutocomplete
            className="border-[#35593F] border-1 rounded-xl"
            label="Target Chain"
            placeholder="select chain"
            inputValue={pathrStore.toChainName??''}
            items={
              BRIDGE_TOKENS.find(item=>item.symbol.toLowerCase()===inputStore.bridgeToken?.toLowerCase())?.chains.filter(item=>item.blockchainName!==pathrStore.fromChainName)
              ||[]
            }
            onSelectionChange={(blockchainName) => {
              pathrStore.setToChainName(blockchainName as string)
              pathrStore.setToChainTokenAddr(allTokens.find(item=>(
                item.symbol===inputStore.bridgeToken
                && item.blockchainName===blockchainName
              ))?.address??null)
            }}
            isClearable={false}
          >
            {(chain) => {
              return <AutocompleteItem key={(chain as any).blockchainName} className="text text-xs"
              >{(chain as any).blockchainName}</AutocompleteItem>
            }}
          </CustomAutocomplete>
        </div>
      </>}

      {displayStore.selectedMenu==='swap'&&<div className="relative w-full">
        <div className="absolute z-10 text-center w-full top-[88px] pointer-events-none">
          <ToggleButton onClick={()=>{
            if (pathrStore.calculating) return
            handleToggle()
          }} />
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <ChainTokenCard direction="from" onClick={()=>{displayStore.setShowChainTokenSelector('from')}} />
          <ChainTokenCard direction="to" onClick={()=>displayStore.setShowChainTokenSelector('to')} />
        </div>
      </div>}

      <InputCard className="mt-4 p-4" />

      {/* {pathrStore.fromChainTokenAddr && pathrStore.toChainTokenAddr && bn(inputStore.tokenAmout||0).gt(0) && */}
        <MainButton fullWidth className="mt-4"
          // disabled={pathrStore.calculating}
          onClick={()=>{
            if (pathrStore.calculating) return
            if (
              !( 
                pathrStore.fromChainTokenAddr 
                && pathrStore.toChainTokenAddr 
                && bn(inputStore.tokenAmout||0).gt(0) 
                && !pathrStore.calculating
              ) 
            ) {
              console.log({
                fromChainTokenAddr: pathrStore.fromChainTokenAddr,
                toChainTokenAddr: pathrStore.toChainTokenAddr,
                tokenAmout: inputStore.tokenAmout,
                calculating: pathrStore.calculating,
                showProviders: displayStore.showProviders,
              })
              return
            }
            pathrStore.updateRouterCalcTime()
            displayStore.setShowProviders(true)
          }}
        >Calculate Routers</MainButton>
      {/* } */}
      
    </div>
  </div>
</div>
  )
})