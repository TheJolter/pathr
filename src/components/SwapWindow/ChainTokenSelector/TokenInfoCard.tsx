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

  const chainIdString = BlockchainInfo[tokenInfo.blockchainName].id.toString(16)
  const balanceKey = `${chainIdString}-${tokenInfo.address}-${address}`.toLowerCase()

  return (
<div className="flex items-center rounded-xl px-3 py-2 mt-4 border hover:border-gray-400 cursor-pointer"
  onClick={()=>{
    if (displayStore.showChainTokenSelector==='from') {
      pathrStore.setFromChainTokenAddr(tokenInfo.address)
    } else if(displayStore.showChainTokenSelector==='to') {
      pathrStore.setToChainTokenAddr(tokenInfo.address)
    }
    displayStore.setShowChainTokenSelector(undefined)
  }}
>
  <img width='32px' height='32px' alt="" className='rounded-full'
    src={`https://assets.rubic.exchange/assets/${tokenInfo.blockchainNetwork}/${tokenInfo.address}/logo.png`}
  />
  <div className="grow flex flex-col justify-between ml-3">
    <div className="flex items-center text-lg">
      <div className="grow">{tokenInfo.symbol}</div>
      <div>
        {bigNumberFloor(balanceStore.balances?.[balanceKey]?.amount||0, 6).toFormat()}
      </div>
    </div>
    <div className="flex items-center text-xs text-gray-400">
      <div>{formatEvmAddr(tokenInfo.address)}</div>
      <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='ml-1' />
      {/* <div className="grow text-right">-$123.45678</div> */}
    </div>
  </div>
</div>
  )
})