import { CSSProperties, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Avatar, Button, CircularProgress, ScrollShadow, input } from "@nextui-org/react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import ChainTokenIcon from "../ChainTokenIcon"
import MainButton from "@/components/MainButton"
import { CrossChainTrade, EvmBlockchainName, EvmWeb3Public, Injector as PathrInjector, OnChainTrade, WrappedCrossChainTrade } from "pathr-sdk"
import bn from "@/utils/bn"
import allTokens from '@/configs/pathr/all-tokens.json'
// import connectEvmWallet from "@/utils/connectEvmWallet"
import { ADDR0 } from "@/configs/pathr/tokens"
import { BlockchainInfo } from "@/configs/pathr/blockchain-info"
import evmSwitchChain from "@/utils/evmSwitchChain"
import getAndSotreBalance from "@/utils/get-and-store-balance"
import { bigNumberCeil } from "@/utils/bigNumberCeilFloor"
import { useConnectWallet } from "@web3-onboard/react"
import {Injector as RubicInjector} from 'rubic-sdk'
import { OWN_CHAINS } from "@/configs/common"

export default observer(function ReviewPathr(props: {
  style?: CSSProperties
}) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const address = wallet?.accounts?.[0]?.address
  const provider = wallet?.provider

  const displayStore = useStore('displayStore')
  const pathrStore = useStore('pathrStore')
  const inputStore = useStore('inputStore')
  const balanceStore = useStore('balanceStore')

  const [isBusy, setIsBusy] = useState(false)

  const chainInfo = BlockchainInfo[pathrStore.fromChainName!]

  let Injector = RubicInjector
  if (OWN_CHAINS.includes(pathrStore.fromChainName as any)) {
    Injector = PathrInjector
  }

  const tokenInfo = allTokens.find(item=>{
    return (
      item.address===pathrStore.fromChainTokenAddr
      && item.blockchainName === pathrStore.fromChainName
    )
  })

  const nativeTokenInfo = allTokens.find(item=>{
    return (
      item.address===ADDR0
      && item.blockchainName === pathrStore.fromChainName
    )
  })

  let trade = pathrStore.trades[displayStore.selectedProiveder] as CrossChainTrade|OnChainTrade
  // console.log('trade', trade) // fee, gas, amounts in routers
  const onChainTradeType = (trade as OnChainTrade)?.type
  const onChainSubtype = (pathrStore.trades[displayStore.selectedProiveder] as WrappedCrossChainTrade).trade?.onChainSubtype
  const crossChainTradeType = (pathrStore.trades[displayStore.selectedProiveder] as WrappedCrossChainTrade).tradeType
  if (pathrStore.fromChainName !== pathrStore.toChainName) {
    trade = (pathrStore.trades[displayStore.selectedProiveder] as WrappedCrossChainTrade).trade as CrossChainTrade|OnChainTrade
  }

  const chainIdString = chainInfo.id.toString(16)
  const balanceKeyForGas = `${chainIdString}-${ADDR0}-${address}`.toLowerCase()
  const gasWanted = bn(trade?.feeInfo?.pathrProxy?.fixedFee?.amount?.toString()||0)
  let gasBalance = balanceStore.balances[balanceKeyForGas]?.amount || bn(0)
  if (pathrStore.fromChainTokenAddr===ADDR0) {
    gasBalance = gasBalance.minus(inputStore.tokenAmout)
  }
  console.log({gasWanted: gasWanted.toString(), gasBalance: gasBalance.toString()})
  const isGasSufficient = bn(gasWanted).gt(gasBalance)

  async function handleSwap() {
    if (!address) {
      const node = document.querySelector('onboard-v2') as HTMLElement
      if (node) node.style.display = 'block'
      connect().then(()=>{
        if (node) node.style.display = 'none'
      })
      return
    }
    const ethereum:any = provider
    console.log('handleSwap chainId', ethereum.chainId)
    if (Number(ethereum.chainId||-1)!==chainInfo.id) {
      evmSwitchChain(`0x${chainInfo.id.toString(16)}`, {provider}).then(()=>{
        handleSwap()
      })
      return
    }

    if (isGasSufficient) {
      displayStore.setWarningDialogParams({title: 'Insufficient gas', 
      content: `You don't have enough gas to complete the transaction. 
      You need to add at least: ${bigNumberCeil(gasWanted.minus(gasBalance), 6).toFixed()} ${nativeTokenInfo?.symbol} on ${pathrStore.fromChainName}`})
      return
    }

    const blockchainAdapter: EvmWeb3Public = Injector.web3PublicService.getWeb3Public(pathrStore.fromChainName as EvmBlockchainName)
    setIsBusy(true)
    let gasPrice = '0'
    try {
      gasPrice = await blockchainAdapter.getGasPrice()
    } catch (err:any) {
      displayStore.setWarningDialogParams({
        title: 'Failed to get Gas', 
        content: err.message || err.toString()})
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
          content: `${err.message || err.toString()}`,
        })
      })
      return
    }

    console.log('gasPrice', gasPrice)
    trade.swap({
      onConfirm:(hash)=>{
      }, 
      gasPrice // required
    }).then(hash=>{
      setIsBusy(false)
      displayStore.setSuccessDialogParams({
        title: 'Swap Success',
        tokenAddr: pathrStore.toChainTokenAddr!,
        tokenAmount: bn(trade.to?.weiAmount.toString()||0).div(bn(10).pow(trade.to?.decimals||0)).toFormat(6),
        tokenUsdValue: '',
        detailsUrl: `${chainInfo.explorer}/tx/${hash}`
      })
      if (address) {
        // getAndSotreBalance
        getAndSotreBalance({
          balanceStore,
          chainId: chainInfo.id,
          tokenAddress: pathrStore.fromChainTokenAddr!,
          account: address
        })
      }
    }).catch(err=>{
      setIsBusy(false)
      console.log('trade.swap error', err, 'gasPrice', gasPrice)
      displayStore.setWarningDialogParams({
        title: 'Swap failed',
        content: `${err.message || err.toString()}`,
      })
    })
  }
  
  return (
<div style={props.style}
  className="w-[392px] rounded-xl px-6 pt-4 mx-2" 
>
  <div className="flex items-center">
    <BackBtn onClick={()=>displayStore.setShowPreviewRubic(false)} />
    <div className="grow text-center text-lg font-semibold">Review Swap</div>
    <BackBtn className="pointer-events-none opacity-0" />
  </div>

  <div
    className={`min-h-[64px] rounded-xl border-[#35593F] border-1 p-3`}
  >
    <div className="flex items-center mb-2">
      <ChainTokenIcon chainName={pathrStore.fromChainName!} tokenAddr={pathrStore.fromChainTokenAddr!} />
      <div className="grow ml-3">
        <div className="text-base font-semibold">
          {/* 12345.6789 USDC */}
          {inputStore.tokenAmout} {tokenInfo?.symbol}
        </div>
        <div className="text-xs text-gray-400">on {pathrStore.fromChainName}</div>
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
      <ChainTokenIcon chainName={pathrStore.toChainName!} tokenAddr={pathrStore.toChainTokenAddr!} />
      <div className="grow ml-3">
        <div className="text-base font-semibold">
          {/* 12345.6789 USDC */}
          { bn(trade.to?.weiAmount.toString()||0).div(bn(10).pow(trade.to?.decimals||0)).toFormat(6)} {trade.to?.symbol}
        </div>
        <div className="text-xs text-gray-400">on {pathrStore.toChainName}</div>
      </div>
    </div>
    
  </div>

  <MainButton fullWidth className="my-4"
    disabled={
      isBusy
      // || isGasSufficient
    }
    onClick={()=>{
      handleSwap()
    }}
  >
    {address?'Start Swap':'Conect Wallet'}
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