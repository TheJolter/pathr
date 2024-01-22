'use client'

import { BlockchainInfo } from "@/configs/rubic/blockchain-info";
import { useStore } from "@/stores/hooks";
import { Button, Tooltip } from "@nextui-org/react";
import { observer } from "mobx-react-lite";

export default observer(function TokenButton(props: {
  // onSelect: (chainName: string) => void,
  chainName: string
}) {
  const {chainName} = props

  const rubicStore = useStore('rubicStore')
  const displayStore = useStore('displayStore')

  const direction = displayStore.showChainTokenSelector
  const chainInfo = BlockchainInfo[chainName]


  let selected = (direction==='from'&&rubicStore.fromChainName===chainName) || (direction==='to'&&rubicStore.toChainName===chainName)

  return (
<>
  <div className="token-button-container flex justify-center items-start">
    <Tooltip showArrow={true} content={chainName}>
      <Button isIconOnly size="md" fullWidth
        className={`${selected?`border-2 border-[#32CA62]`:''}`}
        style={{background: selected?'rgba(50, 202, 98, 0.4)':undefined}}
        onClick={()=>{
          if (direction==='from') {
            rubicStore.setFromChainName(chainName)
            rubicStore.setFromChainTokenAddr(null)
          } else if (direction==='to') {
            rubicStore.setToChainName(chainName)
            rubicStore.setToChainTokenAddr(null)
          }
        }}
      >
        <img height='32px' width='32px'
        src={chainInfo.chainLabel} />
      </Button>
    </Tooltip>
  </div>
</>
  )
})