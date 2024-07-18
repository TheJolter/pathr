'use client'

import { BlockchainInfo } from "@/configs/pathr/blockchain-info";
import { useStore } from "@/stores/hooks";
import { Button, Tooltip } from "@nextui-org/react";
import { observer } from "mobx-react-lite";


export default observer(function TokenButton(props: {
  // onSelect: (chainName: string) => void,
  chainName: string,
  chainLabel?: string
}) {
  const {chainName} = props

  const pathrStore = useStore('pathrStore')
  const displayStore = useStore('displayStore')

  const direction = displayStore.showChainTokenSelector
  const chainInfo = BlockchainInfo[chainName]
  
  let chainLabel = chainInfo?.chainLabel ?? props.chainLabel

  let selected = (direction==='from'&&pathrStore.fromChainName===chainName) || (direction==='to'&&pathrStore.toChainName===chainName)

  return (
<>
  <div className="token-button-container flex justify-center items-start">
    <Tooltip showArrow={true} content={chainName}
      placement="bottom"
    >
      <Button isIconOnly size="md" fullWidth
        className={`${selected?`border-2 border-[#32CA62]`:''}`}
        style={{background: selected?'rgba(50, 202, 98, 0.4)':undefined}}
        onClick={()=>{
          if (!chainInfo) {
            displayStore.setJoltifyChainSelected(
              displayStore.showChainTokenSelector==='from'?'source':'target'
            )
            displayStore.setShowChainTokenSelector(undefined)
            return
          }
          displayStore.setJoltifyChainSelected(null)
          if (direction==='from') {
            pathrStore.setFromChainName(chainName)
            pathrStore.setFromChainTokenAddr(null)
          } else if (direction==='to') {
            pathrStore.setToChainName(chainName)
            pathrStore.setToChainTokenAddr(null)
          }
        }}
      >
        <img height='32px' width='32px'
        src={chainLabel} />
      </Button>
    </Tooltip>
  </div>
</>
  )
})