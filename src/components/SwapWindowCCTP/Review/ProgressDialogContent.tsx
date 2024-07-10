'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons'
import { CHAINS } from '@/configs/cctp/configs'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/hooks'
import { Link } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Dialog } from '@/stores/dialogStore'

export default observer(function ProgressDialogContent({sourceTxHash}:{
  sourceTxHash: string
}) {
  const pathrStore = useStore('pathrStore')
  const dialogStore = useStore('dialogStore')

  const [targetTxHash, setTargetTxHash] = useState<string>()
  const [attestationGenerated, setAttestationGenerated] = useState(false)

  const sourceChain = CHAINS.find(chain=>chain.chainName===pathrStore.fromChainName)
  const targetChain = CHAINS.find(chain=>chain.chainName===pathrStore.toChainName)
  

  useEffect(()=>{
    if (!attestationGenerated) return
    const interval = setInterval(()=>{
      fetch(`https://cctp-api.pathr.io/query_tx?chain=${targetChain?.domain}&src_tx=${sourceTxHash}`)
      .then(res=>res.json()).then(res=>{
        const _targetTxHash = res['dest chain tx']
        if (_targetTxHash) {
          setTargetTxHash(_targetTxHash)
          clearInterval(interval)
          dialogStore.showDialog({
            ...dialogStore.dialog as Dialog,
            forbidClose: false
          })
        }
      })
    }, 5000)
    return ()=>{
      clearInterval(interval)
    }
  }, [attestationGenerated])

  useEffect(()=>{
    if (!sourceTxHash || !sourceChain?.domain) return
    const interval = setInterval(()=>{
      fetch(`https://iris-api.circle.com/v1/messages/${sourceChain?.domain}/${sourceTxHash}`)
      .then(res=>res.json()).then(res=>{
        if (res.messages?.length) {
          for (const message of res.messages) {
            if (message.attestation==='PENDING') {
              return
            }
          }
          setAttestationGenerated(true)
          clearInterval(interval)
        }
      })
    }, 5000)
    return () =>{
      clearInterval(interval)
    }
  }, [sourceTxHash])

  return (
<div className='pb-4 text-xl'>
  <p>
    <FontAwesomeIcon icon={faCheckCircle} color='#00ff00' />
    <span className='ml-2'>Submit transaction</span>
    <Link className='ml-2' target="_blank"
      href={`${sourceChain?.explorer}/tx/${sourceTxHash}`}
    >View Details</Link>
  </p>
  <p>
    {!attestationGenerated&&<FontAwesomeIcon icon={faSpinner} spin />}
    {attestationGenerated&&<FontAwesomeIcon icon={faCheckCircle} color='#00ff00' />}
    <span className='ml-2'>Generate CCTP attestation</span>
  </p>
  <p>
    {!attestationGenerated&&<FontAwesomeIcon icon={faCircle} />}
    {(attestationGenerated&&!targetTxHash)&&<FontAwesomeIcon icon={faSpinner} spin />}
    {targetTxHash&&<FontAwesomeIcon icon={faCheckCircle} color='#00ff00' />}
    <span className='ml-2'>Mint on target chain</span>
    {targetTxHash&&<Link className='ml-2' target="_blank"
      href={`${targetChain?.explorer}/tx/${targetTxHash}`}
    >View Details</Link>}
  </p>
</div>
  )
})

/*
https://cctp-api.pathr.io/query_tx?chain=6&&src_tx=0xd3aa7c0190cfbfb791682fbbd27b4006c779153a3fbb906fc8280ec236312895
{"error":"leveldb: not found"}


https://cctp-api.pathr.io/query_tx?chain=6&&src_tx=0xca93fc2f7c90bad15c004f9e717ac120272fc395e0d46590ca026c4187e38683
{"dest chain tx":"0xab29e02aae7fc8757d1824f0c76afc42681ff1f6f9ffb9fd468eadc9723f6c93"}


https://iris-api.circle.com/v1/messages/3/0x66f39329afca97c3e2a4f0bc995ff06df28c54fb5fe95cb2e7ac139ca39e38cb
{
  "messages": [
    {
      "attestation": "0x3b88a593891e2a6ad373ee4a9181547bb9144f9c40f24afc21e486d49542db74629a6953c04dfe4c6e8edd4487eb4f98a58e97c4c9c2e4d37d9c42e740ed2bf11b9dbdf256a729a3d7839f53a86b25779b568df8e40c3ab1bb7a12b31c8f29ff8576233588c08083fc74265b1333ebdee0b60ad03546ef48dba8c9c2340fd2948e1b",
      "message": "0x000000000000000300000006000000000003ce1a0000000000000000000000003ae6a19b84dec3d7a3725360d0d06494006894a300000000000000000000000030e0b14af367ed65c45c889c6531bdb584b712780000000000000000000000000000000000000000000000000000000000000000000000060001f40000000000000000000000000000000000000000000000000000000000000062000000000000000000000000353755fa4c3d8e73ca5190d86894866e9bd6abb80000000000000000000000004200000000000000000000000000000000000006",
      "eventNonce": "249370"
    },
    {
      "attestation": "0x3de585a4892b42666ce5aba3eec675115f27932306c9a4935c39c778145073670e7364bc37149aac6d12bfd9f52c007ad3001e0e5b512c2d12bf9f0a9d2f82f41cb82d1286e7586327bea3283e6d722a09ad7ffe7cbaa2213f3124e59cda238dd20038c1ea8d7f08376774e95bc26e37c9f25941e6510586cf255dfd521ff541561b",
      "message": "0x000000000000000300000006000000000003ce1900000000000000000000000019330d10d9cc8751218eaf51e8885d058642e08a0000000000000000000000001682ae6375c4e4a97e4b583bc394c861a46d896200000000000000000000000030e0b14af367ed65c45c889c6531bdb584b7127800000000000000000000000000000000af88d065e77c8cc2239327c5edb3a432268e583100000000000000000000000030e0b14af367ed65c45c889c6531bdb584b7127800000000000000000000000000000000000000000000000000000000000000620000000000000000000000003ae6a19b84dec3d7a3725360d0d06494006894a3",
      "eventNonce": "249369"
    }
  ]
}
or
{"error":"Transaction hash not found"}
or
{
  "messages": [
    {
      "attestation": "PENDING",
      "message": "0x000000000000000300000006000000000003d0da0000000000000000000000003ae6a19b84dec3d7a3725360d0d06494006894a300000000000000000000000030e0b14af367ed65c45c889c6531bdb584b712780000000000000000000000000000000000000000000000000000000000000000000000060001f400000000000000000000000000000000000000000000000000000000000003e6000000000000000000000000353755fa4c3d8e73ca5190d86894866e9bd6abb80000000000000000000000004200000000000000000000000000000000000006",
      "eventNonce": "250074"
    },
    {
      "attestation": "PENDING",
      "message": "0x000000000000000300000006000000000003d0d900000000000000000000000019330d10d9cc8751218eaf51e8885d058642e08a0000000000000000000000001682ae6375c4e4a97e4b583bc394c861a46d896200000000000000000000000030e0b14af367ed65c45c889c6531bdb584b7127800000000000000000000000000000000af88d065e77c8cc2239327c5edb3a432268e583100000000000000000000000030e0b14af367ed65c45c889c6531bdb584b7127800000000000000000000000000000000000000000000000000000000000003e60000000000000000000000003ae6a19b84dec3d7a3725360d0d06494006894a3",
      "eventNonce": "250073"
    }
  ]
}
*/