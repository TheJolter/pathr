'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/hooks'
import allTokens from '@/configs/pathr/all-tokens.json'
import { formatEvmAddr } from '@/components/EvmWalletButton/EvmWalletButton'
import { BlockchainInfo } from '@/configs/pathr/blockchain-info'
import { bigNumberFloor } from '@/utils/bigNumberCeilFloor'
import { useConnectWallet } from '@web3-onboard/react'
import getTokenImg from '@/utils/get-token-img'
import { ADDR0 } from '@/configs/pathr/tokens'
import tokensWithUSDCPool from '@/configs/cctp/usdc-pools.json'
import { CCTP_CHAIN_NAMES } from '../Providers'
import { useState } from 'react'
import { TOKENS_WITHOUT_IMG } from '@/configs/tokens-without-img'
import { CHAINS } from '@/configs/cctp/configs'

export default observer(function TokenInfoCard(props: {
  tokenInfo: typeof allTokens[number]
}) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const address = wallet?.accounts?.[0]?.address
  
  const {tokenInfo} = props
  const displayStore = useStore('displayStore')
  const pathrStore = useStore('pathrStore')
  const evmWalletStore = useStore('evmWalletStore')
  const balanceStore = useStore('balanceStore')

  const chainInfo = BlockchainInfo[tokenInfo.blockchainName]

  const chainIdString = chainInfo.id.toString(16)
  const balanceKey = `${chainIdString}-${tokenInfo.address}-${address}`.toLowerCase()

  const chainID = chainInfo.id
  const tokenAddress = tokenInfo.address
  const tokenImg = getTokenImg({chainID, tokenAddress})

  const [hideCard, setHideCard] = useState(false)

  if (
    !(
      tokensWithUSDCPool.find(item=>item.address.toLowerCase()===tokenInfo.address.toLowerCase())
      || CHAINS.find(chain=>chain.usdc.toLowerCase()===tokenInfo.address.toLowerCase())
    )
    && CCTP_CHAIN_NAMES.includes(tokenInfo.blockchainName as any)
  ) {
    // return <></> // show all tokens, not only usdc and pool with usdc
  }

  if (TOKENS_WITHOUT_IMG.toLowerCase().includes(tokenInfo.address.toLowerCase())){
    return <></>
  }

  return (
<div className="flex items-center rounded-xl px-3 py-2 mt-4 border hover:border-gray-400 cursor-pointer"
  style={{display: hideCard?'none':'flex'}}
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
>
  <img width='32px' height='32px' alt="" className='rounded-full'
    src={tokenImg}
    onError={(event) => {
      console.log(tokenInfo.address)
      // setHideCard(true)
      const target = event.target as HTMLImageElement;
      target.onerror = null;
      target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/1200px-Icon-round-Question_mark.svg.png'
    }}
  />
  <div className="grow flex flex-col justify-between ml-3">
    <div className="flex items-center text-lg">
      <div className="grow">{tokenInfo.symbol}</div>
      <div>
        {bigNumberFloor(balanceStore.balances?.[balanceKey]?.amount||0, 6).toFormat()}
      </div>
    </div>
    <div className="flex items-center text-xs text-gray-400">
      <div>{tokenInfo.address===ADDR0?'Native Token':formatEvmAddr(tokenInfo.address)}</div>
      {tokenInfo.address!==ADDR0&&<FontAwesomeIcon icon={faArrowUpRightFromSquare} className='ml-1'
        onClick={(event)=>{
          if (tokenInfo.address===ADDR0) return
          window.open(`${chainInfo.explorer}/address/${tokenInfo.address}`)
          event.stopPropagation()
        }}
      />}
      {/* <div className="grow text-right">-$123.45678</div> */}
    </div>
  </div>
</div>
  )
})