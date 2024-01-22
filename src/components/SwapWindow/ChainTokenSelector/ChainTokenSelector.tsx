import { CSSProperties, useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Button, ScrollShadow } from "@nextui-org/react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import TokenButton from "./TokenButton"
import TokenInfoCard from "./TokenInfoCard"
import { BlockchainInfo } from "@/configs/rubic/blockchain-info"
import allTokens from '@/configs/rubic/all-tokens.json'

export default observer(function ChainTokenSelector(props: {
  style?: CSSProperties
}) {
  const displayStore = useStore('displayStore')
  const rubicStore = useStore('rubicStore')

  const [searchText, setSearchText] = useState('')
  const [tokens, setTokens] = useState<typeof allTokens>([])

  let chainName = rubicStore.fromChainName
  let oppositeChainName = rubicStore.toChainName
  let oppositeTokenAddr = rubicStore.toChainTokenAddr
  if (displayStore.showChainTokenSelector==='to') {
    chainName = rubicStore.toChainName
    oppositeChainName = rubicStore.fromChainName
    oppositeTokenAddr = rubicStore.fromChainTokenAddr
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
    setTokens(
      allTokens.filter(item=>{return item.blockchainName===chainName})
      .filter(item=>{
        return (
          item.address!==oppositeTokenAddr && item.blockchainName===oppositeChainName
          || item.blockchainName!==oppositeChainName
        )
      })
    )
  }, [chainName, searchText])
  
  return (
<div style={props.style}
  className="w-[392px] min-h-[320px] rounded-xl px-6 pt-4" 
>
  <div className="flex items-center">
    <BackBtn onClick={()=>displayStore.setShowChainTokenSelector(undefined)} />
    <div className="grow text-center text-lg font-semibold">Exchange {displayStore.showChainTokenSelector}</div>
    <BackBtn className="pointer-events-none opacity-0" />
  </div>

  <div className="grid grid-cols-6 gap-y-4">
    {Object.keys(BlockchainInfo).map((chainName: string, index)=>{
      return <TokenButton chainName={chainName} key={`BackBtn-${index}`} />
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