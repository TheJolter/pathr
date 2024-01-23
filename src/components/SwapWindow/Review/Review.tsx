import { CSSProperties, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Avatar, Button, CircularProgress, ScrollShadow, input } from "@nextui-org/react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import ChainTokenIcon from "../ChainTokenIcon"
import MainButton from "@/components/MainButton"
import { CrossChainTrade, EvmBlockchainName, EvmWeb3Public, Injector, OnChainTrade, WrappedCrossChainTrade } from "rubic-sdk"
import bn from "@/utils/bn"
import allTokens from '@/configs/rubic/all-tokens.json'
import connectEvmWallet from "@/utils/connectEvmWallet"
import { ADDR0 } from "@/configs/rubic/tokens"
import { BlockchainInfo } from "@/configs/rubic/blockchain-info"
import getEthereum from "@/utils/getEthereum"
import evmSwitchChain from "@/utils/evmSwitchChain"
import getAndSotreBalance from "@/utils/get-and-store-balance"

export default observer(function Review(props: {
  style?: CSSProperties
}) {

  const displayStore = useStore('displayStore')
  const rubicStore = useStore('rubicStore')
  const inputStore = useStore('inputStore')
  const evmWalletStore = useStore('evmWalletStore')
  const balanceStore = useStore('balanceStore')

  const [isBusy, setIsBusy] = useState(false)

  const chainInfo = BlockchainInfo[rubicStore.fromChainName!]

  const tokenInfo = allTokens.find(item=>{
    return (
      item.address===rubicStore.fromChainTokenAddr
      && item.blockchainName === rubicStore.fromChainName
    )
  })

  let trade = rubicStore.trades[displayStore.selectedProiveder] as CrossChainTrade|OnChainTrade
  // console.log('trade', trade) // fee, gas, amounts in routers
  const onChainTradeType = (trade as OnChainTrade).type
  const onChainSubtype = (rubicStore.trades[displayStore.selectedProiveder] as WrappedCrossChainTrade).trade?.onChainSubtype
  const crossChainTradeType = (rubicStore.trades[displayStore.selectedProiveder] as WrappedCrossChainTrade).tradeType
  if (rubicStore.fromChainName !== rubicStore.toChainName) {
    trade = (rubicStore.trades[displayStore.selectedProiveder] as WrappedCrossChainTrade).trade as CrossChainTrade|OnChainTrade
  }

  async function handleSwap() {
    if (!evmWalletStore.address) {
      connectEvmWallet({evmWalletStore})
      return
    }
    const ethereum = getEthereum()

    if (Number(ethereum.chainId)!==chainInfo.id) {
      evmSwitchChain(`0x${chainInfo.id.toString(16)}`).then(()=>{
        handleSwap()
      })
      return
    }

    const blockchainAdapter: EvmWeb3Public = Injector.web3PublicService.getWeb3Public(rubicStore.fromChainName as EvmBlockchainName)
    setIsBusy(true)
    let gasPrice = '0'
    try {
      gasPrice = await blockchainAdapter.getGasPrice()
    } catch (err:any) {
      displayStore.setWarningDialogParams({title: 'Failed to get Gas', content: err.toString()})
      setIsBusy(false)
      return
    }
    let needApprove = false
    if (trade.from.address!==ADDR0) {
      needApprove = await trade.needApprove()
      console.log({needApprove})
    }
    if (needApprove) {
      const tx = {
        onTransactionHash: (hash: string) => {
          console.log(`Approve transaction was sent.`, hash)
        },
        gasPrice // required!!
      }
      trade.approve(tx, false).then(()=>{
        handleSwap()
      }).catch((err)=>{
        setIsBusy(false)
        console.error('trade.approve error', err)
        displayStore.setWarningDialogParams({
          title: 'Failed to approve',
          content: `❌ trade.approve failed: ${err.toString()}`,
        })
      })
      return
    }

    trade.swap({
      onConfirm:(hash)=>{
        // dialogStore.setDialogParams({
        //   title: '✅ Swap transaction sent',
        //   content: <>
        //     <Button onClick={()=>{
        //       window.open(`${BlockchainInfo[fromChainName].explorer}/tx/${hash}`)
        //     }}>Click here</Button>to view details
        //   </>,
        //   isShow: true
        // })
      }, 
      gasPrice // required
    }).then(hash=>{
      setIsBusy(false)
      displayStore.setSuccessDialogParams({
        title: 'Swap Success',
        tokenAddr: rubicStore.toChainTokenAddr!,
        tokenAmount: bn(trade.to?.weiAmount.toString()||0).div(bn(10).pow(trade.to?.decimals||0)).toFormat(6),
        tokenUsdValue: '',
        detailsUrl: `${chainInfo.explorer}/tx/${hash}`
      })
      // displayStore.setSuccessDialogParams({
      //   title: '✅ Swap transaction sent',
      //   content: <>
      //     <Button onClick={()=>{
      //       window.open(`${BlockchainInfo[fromChainName].explorer}/tx/${hash}`)
      //     }}>Click here</Button>to view details
      //   </>,
      //   isShow: true
      // })
      if (evmWalletStore.address) {
        // getAndSotreBalance
        getAndSotreBalance({
          balanceStore,
          chainId: chainInfo.id,
          tokenAddress: rubicStore.fromChainTokenAddr!,
          account: evmWalletStore.address
        })
      }
    }).catch(err=>{
      setIsBusy(false)
      console.log('trade.swap error', err, 'gasPrice', gasPrice)
      displayStore.setWarningDialogParams({
        title: 'Swap failed',
        content: `${err.toString()}`,
      })
    })
  }
  
  return (
<div style={props.style}
  className="w-[392px] rounded-xl px-6 pt-4" 
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
        <div className="text-base font-semibold">
          {/* 12345.6789 USDC */}
          {inputStore.tokenAmout} {tokenInfo?.symbol}
        </div>
        <div className="text-xs text-gray-400">on {rubicStore.fromChainName}</div>
      </div>
    </div>

    {onChainTradeType&&<div className="flex items-center pl-6">
      <Avatar name={onChainTradeType?.[0].toUpperCase()} className="w-6 h-6 text-base" />
      <div className="grow ml-3">
        <div className="text-base">Swap Via {onChainTradeType}</div>
        {/* <div className="text-xs text-gray-400">123.456 USDC {`>`} 123.456 USDT</div> */}
      </div>
    </div>}

    {/* {onChainSubtype?.from&&<div className="flex items-center pl-6">
      <Avatar name={onChainSubtype?.from?.[0].toUpperCase()} className="w-6 h-6 text-base" />
      <div className="grow ml-3">
        <div className="text-base">Swap Via {onChainSubtype?.from}</div>
        <div className="text-xs text-gray-400">123.456 USDC {`>`} 123.456 USDT</div>
      </div>
    </div>} */}

    {crossChainTradeType&&<div className="flex items-center pl-6">
      <Avatar name={crossChainTradeType[0].toUpperCase()} className="w-6 h-6 text-base" />
      <div className="grow ml-3">
        <div className="text-base">Swap Via {crossChainTradeType}</div>
        {/* <div className="text-xs text-gray-400">123.456 USDC {`>`} 123.456 USDT</div> */}
      </div>
    </div>}

    {onChainSubtype?.to&&<div className="flex items-center pl-6">
      <Avatar name={onChainSubtype?.to?.[0].toUpperCase()} className="w-6 h-6 text-base" />
      <div className="grow ml-3">
        <div className="text-base">Bridge Via {onChainSubtype?.to}</div>
        {/* <div className="text-xs text-gray-400">123.456 USDC {`>`} 123.456 USDT</div> */}
      </div>
    </div>}

    <div className="flex items-center mt-2">
      <ChainTokenIcon chainName={rubicStore.toChainName!} tokenAddr={rubicStore.toChainTokenAddr!} />
      <div className="grow ml-3">
        <div className="text-base font-semibold">
          {/* 12345.6789 USDC */}
          { bn(trade.to?.weiAmount.toString()||0).div(bn(10).pow(trade.to?.decimals||0)).toFormat(6)} {trade.to?.symbol}
        </div>
        <div className="text-xs text-gray-400">on {rubicStore.toChainName}</div>
      </div>
    </div>
    
  </div>

  <MainButton fullWidth className="my-4"
    disabled={isBusy}
    onClick={()=>{
      handleSwap()
    }}
  >
    {evmWalletStore.address?'Start Swap':'Conect Wallet'}
    {isBusy&&<CircularProgress size="sm" color="default" />}
  </MainButton>
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