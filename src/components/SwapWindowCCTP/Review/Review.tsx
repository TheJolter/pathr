import { CSSProperties, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Avatar, Button, CircularProgress, Link, ScrollShadow, input } from "@nextui-org/react"
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
import { getERC20Allowance } from "@/utils/erc20Allowance"
import { CHAINS } from "@/configs/cctp/configs"
import { approveERC20 } from "@/utils/erc20Approve"
import { ethers } from "ethers"
import { swapExactInputSingle } from "@/utils/cctp/swapExactInputSingle"
import ProgressDialogContent from "./ProgressDialogContent"

export default observer(function Review(props: {
  style?: CSSProperties
}) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const address = wallet?.accounts?.[0]?.address
  const provider = wallet?.provider

  const displayStore = useStore('displayStore')
  const pathrStore = useStore('pathrStore')
  const inputStore = useStore('inputStore')
  const balanceStore = useStore('balanceStore')
  const cctpStore = useStore('cctpStore')
  const dialogStore = useStore('dialogStore')

  const swapInfo = cctpStore.swapInfo

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

    if (!swapInfo) {
      dialogStore.showDialog({
        title: 'Faled',
        content: `swapInfo not found`
      })
      return
    }

    const sourceChain = CHAINS.find(chain=>chain.chainName===pathrStore.fromChainName)
    const targetChain = CHAINS.find(chain=>chain.chainName===pathrStore.toChainName)
    if (!sourceChain?.bridgeAddress) {
      dialogStore.showDialog({
        title: 'Faled',
        content: `bridge contract can not found on chain ${pathrStore.fromChainName}`
      })
      return
    }
    if (targetChain?.domain===undefined) {
      dialogStore.showDialog({
        title: 'Faled',
        content: `domain not found on chain ${pathrStore.toChainName}`
      })
      return
    }

    if (!targetChain.receiverContract) {
      dialogStore.showDialog({
        title: 'Faled',
        content: `receiver contract not found on chain ${pathrStore.toChainName}`
      })
      return
    }

    const baseAmountIn = bn(swapInfo.amountIn).times(bn(10).pow(swapInfo.tokenIn.decimals)).toFixed(0)
    

    // check balance before swap
    const balanceKey = `${sourceChain.chainId}-${pathrStore.fromChainTokenAddr}-${address}`
    const balance = balanceStore.balances[balanceKey]?.amount || 0
    if (bn(balance).lt(inputStore.tokenAmout)) {
      displayStore.setWarningDialogParams({
        title: 'Insufficient Balance', 
        content: `You don't have enough ${tokenInfo?.symbol} on ${pathrStore.fromChainName} to complete the transaction.`})
      return
    }

    setIsBusy(true)
    try {
      const allowance = await getERC20Allowance({
        tokenAddress: swapInfo.tokenIn.address,
        ownerAddress: address,
        spenderAddress: sourceChain.bridgeAddress,
        rpcUrl: sourceChain.rpc
      })
      
      if (allowance.lt(baseAmountIn)) {
        await approveERC20({
          tokenAddress: swapInfo.tokenIn.address,
          spenderAddress: sourceChain.bridgeAddress,
          amount: baseAmountIn,
        })
        setTimeout(()=>{
          handleSwap()
        }, 5000)
      }
    } catch(error:any) {
      setIsBusy(false)
      dialogStore.showDialog({
        title: 'Faled',
        content: `approve failed: ${error?.message}`
      })
      return
    }

    console.log('swapExactInputSingle', {
      contractAddress: sourceChain.bridgeAddress,
      amountIn: ethers.BigNumber.from(baseAmountIn),
      inToken: swapInfo.tokenIn.address,
      outToken: swapInfo.tokenOut.address,
      targetChain: ethers.BigNumber.from(targetChain.domain),
      receiver: address,
      receiverContract: targetChain.receiverContract,
      poolFee: ethers.BigNumber.from(Math.round(swapInfo.fee*1000000)),
      destPoolFee: ethers.BigNumber.from(Math.round(swapInfo.targetFee*1000000))
    })

    swapExactInputSingle({
      contractAddress: sourceChain.bridgeAddress,
      amountIn: ethers.BigNumber.from(baseAmountIn),
      inToken: swapInfo.tokenIn.address,
      outToken: swapInfo.tokenOut.address,
      targetChain: ethers.BigNumber.from(targetChain.domain),
      receiver: address,
      receiverContract: targetChain.receiverContract,
      poolFee: ethers.BigNumber.from(Math.round(swapInfo.fee*1000000)),
      destPoolFee: ethers.BigNumber.from(Math.round(swapInfo.targetFee*1000000))
    }).then(res=>{
      dialogStore.showDialog({
        forbidClose: true,
        title: 'Do not close this dialog',
        content: (
          <ProgressDialogContent sourceTxHash={res.transactionHash} />
        )
      })
    }).catch(error=>{
      dialogStore.showDialog({
        title: 'Faled',
        content: `swap failed: ${error?.message}`
      })
    }).finally(()=>{
      setIsBusy(false)
    })
  }
  
  return (
<div style={props.style}
  className="w-[392px] rounded-xl px-6 pt-4 mx-2" 
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
      <ChainTokenIcon chainName={pathrStore.fromChainName!} tokenAddr={pathrStore.fromChainTokenAddr!} />
      <div className="grow ml-3">
        <div className="text-base font-semibold">
          {swapInfo?.amountIn} {swapInfo?.tokenIn.symbol}
        </div>
        <div className="text-xs text-gray-400">on {pathrStore.fromChainName}</div>
      </div>
    </div>

    <div className="flex items-center pl-6">
      <Avatar size="sm" src="https://uniswap.org/favicon.ico" />
      <div className="grow ml-3">
        <div className="text-base">Swap Via Uniswap</div>
      </div>
    </div>

    <div className="flex items-center mt-2">
      <ChainTokenIcon chainName={pathrStore.toChainName!} tokenAddr={pathrStore.toChainTokenAddr!} />
      <div className="grow ml-3">
        <div className="text-base font-semibold">
          {swapInfo?.amountOut} {swapInfo?.tokenOut.symbol}
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