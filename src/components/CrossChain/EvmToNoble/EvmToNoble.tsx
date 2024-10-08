import { useStore } from "@/stores/hooks"
import evmToNoble from "@/utils/evm-to-noble/evmToNoble"
import { Button } from "@nextui-org/react"
import { observer } from "mobx-react-lite"
import { useState } from "react"
import { Spinner, Link } from "@nextui-org/react";
import watchCosmosUsdcChange from "@/utils/watchCosmosTokenChange"
import { chains } from "@/components/USDC/chains"
import getUsdcBalance from "@/utils/get-usdc-balance"
import watchCctpAttastation from "@/utils/watchCctpAttastation"
import allowanceCheckAndApprove from "@/utils/allowanceCheckAndApprove"
import { BACKEND_BASE_API_URL } from "@/configs/cctp/backend"

export default observer(function EvmToNoble({
  disabled
}:{
  disabled?: boolean
}) {
  const inputStore = useStore('inputStore')
  const modalStore = useStore('modalStore')
  const evmWalletStore = useStore('evmWalletStore')
  const balanceStore = useStore('balanceStore')
  const [sending, setSending] = useState(false)
  const targetChain = chains.find(c => c.chainID === inputStore.targetChainID)
  const sourceChain = chains.find(c => c.chainID === inputStore.sourceChainID)

  console.log('sourceChain', sourceChain)

  const handleEvmToNoble = async () => {
    if (!evmWalletStore.address || Number(inputStore.amount)<=0 || !inputStore.targetAddress) return
    setSending(true)
    try {
      
      const ethereum = (window as any).ethereum as any
      if (ethereum.chainId !== sourceChain?.chainID ) {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: sourceChain?.chainID }]
          })
        } catch (error:any) {
          setSending(false)
          modalStore.showModal({
            title: 'Error',
            body: error.message ?? error.toString(),
          })
          return
        }
      }

      console.log('approve start', {
        evmChainID: sourceChain?.chainID ?? '',
        amount: inputStore.amount
      })
      await allowanceCheckAndApprove({
        evmChainID: sourceChain?.chainID ?? '',
        amount: inputStore.amount
      })
      console.log('approve end')
    } catch(error:any) {
      console.error(error)
      setSending(false)
      modalStore.showModal({
        title: 'Error',
        body: error.message ?? error.toString(),
      })
      return
    }
    console.log('approve success, evmToNoble start')
    evmToNoble({
      sourceChainID: inputStore.sourceChainID,
      amount: inputStore.amount,
      targetAddress: inputStore.targetAddress
    }).then((txRpt) => {
      console.log('evmToNoble txRpt', txRpt)
      watchCctpAttastation({domain: sourceChain?.domain!, txHash: txRpt.transactionHash}).then((attestation) => {
        fetch(`${BACKEND_BASE_API_URL}/api/mint-on-noble`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(attestation)
        }).then(res => res.json()).then(console.log).catch(console.error)
      })
      watchCosmosUsdcChange({chainID: inputStore.targetChainID, address: inputStore.targetAddress, timeoutSecond: 99999}).then(() => {
        modalStore.showModal({
          title: '✅ Success',
          body: (
            <div>
              <p>Send to Noble successfully</p>
              <p><Link href={`${targetChain?.explorer}/accounts/${inputStore.targetAddress}`} target="_blank">Click here</Link> to view on explorer</p>
            </div>
          )
        })
      }).catch((e) => {
        modalStore.showModal({
          title: 'It may take a while to received on noble, please check later',
          body: e.message ?? e.toString()
        })
      }).finally(()=>{
        setSending(false)
        getUsdcBalance({chainID: sourceChain?.chainID ?? '', address: evmWalletStore.address!}).then(balance => {
          balanceStore.addUsdcBalance({chainID: sourceChain?.chainID ?? '', balance, address: evmWalletStore.address!})
        })
      })
    }).catch((e) => {
      setSending(false)
      modalStore.showModal({
        title: '❌ Failed to send to Noble',
        body: e.message ?? e.toString()
      })
    })
  }

  return (
    <Button color="success"
      onClick={handleEvmToNoble}
      disabled={sending || disabled}
    >
      Send to Noble
      {sending&&<Spinner size="sm" color="default"/>}
    </Button>
  )
})