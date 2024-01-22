'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/hooks'
import allTokens from '@/configs/rubic/all-tokens.json'
import { formatEvmAddr } from '@/components/EvmWalletButton/EvmWalletButton'

export default observer(function TokenInfoCard(props: {
  tokenInfo: typeof allTokens[number]
}) {
  const {tokenInfo} = props
  const displayStore = useStore('displayStore')
  const rubicStore = useStore('rubicStore')

  return (
<div className="flex items-center rounded-xl px-3 py-2 mt-4 border hover:border-gray-400 cursor-pointer"
  onClick={()=>{
    if (displayStore.showChainTokenSelector==='from') {
      rubicStore.setFromChainTokenAddr(tokenInfo.address)
    } else if(displayStore.showChainTokenSelector==='to') {
      rubicStore.setToChainTokenAddr(tokenInfo.address)
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
      <div>-123.45678</div>
    </div>
    <div className="flex items-center text-xs text-gray-400">
      <div>{formatEvmAddr(tokenInfo.address)}</div>
      <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='ml-1' />
      <div className="grow text-right">-$123.45678</div>
    </div>
  </div>
</div>
  )
})