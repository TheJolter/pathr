import { CSSProperties } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Avatar, Button, ScrollShadow } from "@nextui-org/react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import ChainTokenIcon from "../ChainTokenIcon"
import MainButton from "@/components/MainButton"

export default observer(function Review(props: {
  style?: CSSProperties
}) {

  const displayStore = useStore('displayStore')
  const rubicStore = useStore('rubicStore')
  
  return (
<div style={props.style}
  className="w-[392px] min-h-[320px] rounded-xl px-6 pt-4" 
>
  <div className="flex items-center">
    <BackBtn onClick={()=>displayStore.setShowPreview(false)} />
    <div className="grow text-center text-lg font-semibold">Review Swap</div>
    <BackBtn className="pointer-events-none opacity-0" />
  </div>

  <div
    className={`min-h-[64px] rounded-xl border-[#35593F] border-1 p-3`}
  >
    <div className="flex items-center mb-2">
      <ChainTokenIcon chainName={rubicStore.fromChainName!} tokenAddr={rubicStore.fromChainTokenAddr!} />
      <div className="grow ml-3">
        <div className="text-base font-semibold">12345.6789 USDC</div>
        <div className="text-xs text-gray-400">on {rubicStore.fromChainName}</div>
      </div>
    </div>

    <div className="flex items-center pl-6">
      <Avatar name={'LiFi'[0].toUpperCase()} className="w-6 h-6 text-base" />
      <div className="grow ml-3">
        <div className="text-base">Swap Via LiFi</div>
        <div className="text-xs text-gray-400">123.456 USDC {`>`} 123.456 USDT</div>
      </div>
    </div>

    <div className="flex items-center pl-6">
      <Avatar name={'LiFi'[0].toUpperCase()} className="w-6 h-6 text-base" />
      <div className="grow ml-3">
        <div className="text-base">Bridge Via LiFi</div>
        <div className="text-xs text-gray-400">123.456 USDC {`>`} 123.456 USDT</div>
      </div>
    </div>

    <div className="flex items-center mt-2">
      <ChainTokenIcon chainName={rubicStore.toChainName!} tokenAddr={rubicStore.toChainTokenAddr!} />
      <div className="grow ml-3">
        <div className="text-base font-semibold">12345.6789 USDC</div>
        <div className="text-xs text-gray-400">on {rubicStore.toChainName}</div>
      </div>
    </div>
    
  </div>

  <MainButton fullWidth className="my-4"
    onClick={()=>displayStore.setSuccessDialogParams({
      title: 'Swap Success',
      tokenAddr: '0xaaa',
      tokenAmount: '1234.56789',
      tokenUsdValue: '$1234.5678',
      detailsUrl: 'http://google.com',
      chainId: '0x1'
    })}
  >Start Swap</MainButton>
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