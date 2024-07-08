'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { CHAINS } from '@/configs/cctp/configs'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/hooks'
import { Link } from '@nextui-org/react'
import { useEffect, useState } from 'react'

export default observer(function ProgressDialogContent({sourceTxHash}:{
  sourceTxHash: string
}) {
  const pathrStore = useStore('pathrStore')

  const [targetTxHash, setTargetTxHash] = useState<string>()

  const sourceChain = CHAINS.find(chain=>chain.chainName===pathrStore.fromChainName)
  const targetChain = CHAINS.find(chain=>chain.chainName===pathrStore.toChainName)

  useEffect(()=>{
    let interval: NodeJS.Timeout
    setTimeout(()=>{
      interval = setInterval(()=>{
        fetch(`https://cctp-api.pathr.io/query_tx?chain=${targetChain?.domain}&src_tx=${sourceTxHash}`)
        .then(res=>res.json()).then(res=>{
          if (res.tx_hash) {
            setTargetTxHash(res.tx_hash)
            clearInterval(interval)
          }
        })
      }, 5000)
    }, 30000)
    return ()=>{
      clearInterval(interval)
    }
  }, [])

  return (
<div>
  <p>
    Transaction sent, <Link target="_blank"
      href={`${sourceChain?.explorer}/tx/${sourceTxHash}`}
    >Click Here</Link> to view it on Explorer
  </p>
  {!targetTxHash&&<p>
    <span>Sedinging to destination chain...</span>
    <FontAwesomeIcon icon={faSpinner} spin />
  </p>}
  {targetTxHash&&<p>
    🎉 Minted, <Link target="_blank"
      href={`${targetChain?.explorer}/tx/${targetTxHash}`}
    >Click Here</Link> to view it on Explorer
  </p>}
  <p>You can close and check later</p>
</div>
  )
})