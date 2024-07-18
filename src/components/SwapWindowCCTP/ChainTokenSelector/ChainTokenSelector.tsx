import { CSSProperties, useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Avatar, Button, Chip, ScrollShadow } from "@nextui-org/react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import TokenButton from "./TokenButton"
import TokenInfoCard from "./TokenInfoCard"
import { BlockchainInfo } from "@/configs/pathr/blockchain-info"
import allTokens from '@/configs/pathr/all-tokens.json'
import { ADDR0 } from "@/configs/pathr/tokens"
import { EVM_BLOCKCHAIN_NAME } from "pathr-sdk"
import { CHAINS } from "@/configs/cctp/configs"
import usdcPools from '@/configs/cctp/usdc-pools.json'
import { HOT_TOKEN_SYMBOLS } from "@/configs/hot-token-symbles"

export default observer(function ChainTokenSelector(props: {
  style?: CSSProperties
}) {
  const displayStore = useStore('displayStore')
  const pathrStore = useStore('pathrStore')

  const hostname = (window as any).location?.hostname

  const [searchText, setSearchText] = useState('')
  const [tokens, setTokens] = useState<typeof allTokens>([])
  const [hotTokens, setHotTokens] = useState<typeof allTokens>([])

  let chainName = pathrStore.fromChainName
  let oppositeChainName = pathrStore.toChainName
  let oppositeTokenAddr = pathrStore.toChainTokenAddr
  if (displayStore.showChainTokenSelector==='to') {
    chainName = pathrStore.toChainName
    oppositeChainName = pathrStore.fromChainName
    oppositeTokenAddr = pathrStore.fromChainTokenAddr
  }
  // console.log({oppositeChainName, oppositeTokenAddr})
  // const chainInfo = BlockchainInfo[chainName!]
  // let tokens = allTokens.filter(item=>{return item.blockchainName===chainName})

  useEffect(()=>{
    if (searchText) {
      setTokens(
        allTokens.filter(item=>{return item.blockchainName===chainName})
        .filter(item=>{
          return item.address.toLowerCase().includes(searchText.toLowerCase()) || item.symbol.toLowerCase().includes(searchText.toLowerCase())
        })
        .filter(item=>{return (
          item.address!==oppositeTokenAddr && item.blockchainName===oppositeChainName
          || item.blockchainName!==oppositeChainName
        )})
      )
      return
    }

    const allTokensHot = allTokens.filter(item=>{
      return (
        item.blockchainName===chainName
        && HOT_TOKEN_SYMBOLS.includes(item.symbol)
      )
    })
    .filter(item=>{
      return (
        item.address!==oppositeTokenAddr && item.blockchainName===oppositeChainName
        || item.blockchainName!==oppositeChainName
      )
    })
    setHotTokens(allTokensHot)

    const allTokensNotHot = allTokens.filter(item=>{
      return (
        item.blockchainName===chainName
        && !HOT_TOKEN_SYMBOLS.includes(item.symbol)
      )
    })
    .filter(item=>{
      return (
        item.address!==oppositeTokenAddr && item.blockchainName===oppositeChainName
        || item.blockchainName!==oppositeChainName
      )
    })
    
    setTokens([...allTokensHot, ...allTokensNotHot])
  }, [chainName, searchText])
  
  return (
<div style={props.style}
  className="w-[392px] min-h-[320px] rounded-xl px-6 pt-4 mx-2" 
>
  <div className="flex items-center">
    <BackBtn onClick={()=>displayStore.setShowChainTokenSelector(undefined)} />
    <div className="grow text-center text-lg font-semibold">
      Exchange {displayStore.showChainTokenSelector}
      {displayStore.selectedMenu==='gas'&&'(Gas token)'}
    </div>
    <BackBtn className="pointer-events-none opacity-0" />
  </div>

  <div className="grid grid-cols-6 gap-y-4">
    {Object.keys(BlockchainInfo).map((chainName: string, index)=>{

      // only show Arbitrum chain
      if (
        chainName!==EVM_BLOCKCHAIN_NAME.ARBITRUM
        && displayStore.showChainTokenSelector==='from'
        && false
      ) return

      // only show CCTP chains
      // const chainID = BlockchainInfo[chainName].id
      // if (!CHAINS.find(item=>item.chainId===chainID)) return

      // only show the target chain that is not the same as the source chain
      // if (
      //   displayStore.showChainTokenSelector==='to'
      //   && chainName===pathrStore.fromChainName
      // ) return

      return <TokenButton chainName={chainName} key={`BackBtn-${index}`} />
    })}
    {displayStore.selectedMenu==='bridge'&&<TokenButton chainName={'JOLTIFY'} 
      chainLabel="https://joltify.io/wp-content/uploads/2023/09/joltify-02.png"
    />}
  </div>

  <div className="my-4 grid grid-cols-3 gap-3 p-2">
    {hotTokens.map((tokenInfo, index)=>{
      return (
        <Chip className="cursor-pointer" variant="flat" key={`hot-token-${index}`}
          onClick={()=>{
            if (displayStore.showChainTokenSelector==='from') {
              pathrStore.setFromChainTokenAddr(tokenInfo.address)
              if (displayStore.selectedMenu==='bridge') {
                if (pathrStore.fromChainName===pathrStore.toChainName) {
                  console.log('same chian')
                  pathrStore.setToChainTokenAddr(null)
                  pathrStore.setToChainName(null)
                } else {
                  // find same symbol token in the target chain
                  const sourceSymbol = allTokens.find(item=>{
                    return (
                      item.blockchainName===pathrStore.fromChainName
                      && item.address.toLowerCase()===pathrStore.fromChainTokenAddr?.toLowerCase()
                    )
                  })?.symbol
                  console.log('sourceSymbol', sourceSymbol)
                  const targetTokenAddr = allTokens.find(item=>{
                    return (
                      item.blockchainName===pathrStore.toChainName
                      && item.symbol.toLowerCase()===sourceSymbol?.toLowerCase()
                    )
                  })?.address
                  console.log('targetTokenAddr', targetTokenAddr)
                  pathrStore.setToChainTokenAddr(targetTokenAddr??null)
                }
              }
            } else if(displayStore.showChainTokenSelector==='to') {
              pathrStore.setToChainTokenAddr(tokenInfo.address)
              if (displayStore.selectedMenu==='bridge') {
                if (pathrStore.fromChainName===pathrStore.toChainName) {
                  console.log('same chian')
                  pathrStore.setFromChainTokenAddr(null)
                  pathrStore.setFromChainName(null)
                } else {
                  // find same symbol token in the source chain
                  const targetSymbol = allTokens.find(item=>{
                    return (
                      item.blockchainName===pathrStore.toChainName
                      && item.address.toLowerCase()===pathrStore.toChainTokenAddr?.toLowerCase()
                    )
                  })?.symbol
                  console.log('targetSymbol', targetSymbol)
                  const sourceTokenAddr = allTokens.find(item=>{
                    return (
                      item.blockchainName===pathrStore.fromChainName
                      && item.symbol.toLowerCase()===targetSymbol?.toLowerCase()
                    )
                  })?.address
                  console.log('sourceTokenAddr', sourceTokenAddr)
                  pathrStore.setFromChainTokenAddr(sourceTokenAddr??null)
                }
              }
            }
            displayStore.setShowChainTokenSelector(undefined)
          }} 
          avatar={<Avatar src={tokenInfo.image}/>}
        >{tokenInfo.symbol}</Chip>
      )
    })}
  </div>

  <div className="flex items-center border border-gray-400 mt-5 rounded-xl">
    <input placeholder="Search by token name or address" value={searchText}
      className="grow bg-transparent focus:outline-none border-none pl-3 text-base"
      onChange={(e)=>setSearchText(e.target.value)}
    />
    <Button isIconOnly className="bg-transparent">
      <FontAwesomeIcon icon={faSearch} />
    </Button>
  </div>

  <ScrollShadow className="max-h-[400px]">
    {tokens.map((tokenInfo, index)=>{
      return <TokenInfoCard tokenInfo={tokenInfo} key={`token-info-${index}`} />
    })}
  </ScrollShadow>
</div>
  )
})

function BackBtn(props: {
  onClick?: ()=>void,
  className?: string
}) {
  return (
<Button isIconOnly size="lg" variant="light" radius="full" onClick={props.onClick}
  className={`${props.className}`}
>
  <FontAwesomeIcon icon={faArrowLeft} />
</Button>
)
}