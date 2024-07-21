import { CosmosChain, chains } from "@/components/USDC/chains"
import { useStore } from "@/stores/hooks"
import { MsgTransferEncodeObject, SigningStargateClient } from "@cosmjs/stargate"
import { Keplr } from "@keplr-wallet/types"
import { Button, Link, Spinner } from "@nextui-org/react"
import { observer } from "mobx-react-lite"
import { useState } from "react"
import { Decimal } from "@cosmjs/math" // "@cosmjs/stargate/node_modules/@cosmjs/math/build/decimal" // "@cosmjs/math"
import bn from "@/utils/bn"
import { nobleFee } from "@/components/USDC/config"
import watchCosmosUsdcChange from "@/utils/watchCosmosTokenChange"
import getUsdcBalance from "@/utils/get-usdc-balance"
import cosmosAddrConvertor from "@/utils/cosmosAddrConvertor"

export default observer(function BetweenCosmos({
  disabled
}:{
  disabled?: boolean
}) {
  const inputStore = useStore('inputStore')
  const balanceStore = useStore('balanceStore')
  const modalStore = useStore('modalStore')
  const targetChain = chains.find(c => c.chainID === inputStore.targetChainID) as CosmosChain
  const sourceChain = chains.find(c => c.chainID === inputStore.sourceChainID) as CosmosChain
  const [sending, setSending] = useState(false)

  const handleSendIbc = async () => {
    console.log('handleSendIbc')
    const keplr:Keplr = (window as any).keplr
    if (!keplr || !sourceChain) {
      console.log({keplr, sourceChain})
      return
    }
    const signer = keplr.getOfflineSignerOnlyAmino(sourceChain.chainID)
    setSending(true)
    const sender = (await signer.getAccounts())[0].address
    // @ts-ignore
    const client = await SigningStargateClient.connectWithSigner(sourceChain.rpc, signer, {gasPrice: {amount: Decimal.fromUserInput('4000', 0), denom: sourceChain.nativeToken}})
    const gasFee = bn(nobleFee).times(1e6).toFixed(0)
    let amount = bn(inputStore.amount).times(1e6).toFixed(0)
    if (sourceChain.chainID === 'noble-1') {
      const balanceNoble = balanceStore.getUsdcBalance('noble-1', sender)
      if (bn(amount).plus(gasFee).gt( bn(balanceNoble).times(10**6) )) {
        amount = bn(balanceNoble).times(10**6).minus(gasFee).toFixed(0)
      }
    }
    const msg:MsgTransferEncodeObject = {
      typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
      value: {
        sourcePort: "transfer",
        sourceChannel: sourceChain.chainID==='noble-1'?'channel-81':'channel-1',
        token: {denom: sourceChain.usdcAddress, amount},
        sender, 
        receiver: inputStore.targetAddress,
        timeoutTimestamp: BigInt((new Date().getTime()+10*60*1000)*1000000),
        memo: '', // can not be undefined
      }
    }
    console.log({msg})

    client.signAndBroadcast(sender, [msg], 'auto').then((res) => {
      console.log(res)
      if (res.code===0) {
        watchCosmosUsdcChange({chainID: inputStore.targetChainID, address: inputStore.targetAddress, timeoutSecond: 600}).then(() => {
          setSending(false)
          modalStore.showModal({
            title: '✅ Success',
            body: (
              <div>
                <p>Send to {targetChain.chainName} successfully</p>
                <p><Link href={`${targetChain?.explorer}/accounts/${inputStore.targetAddress}`} target="_blank">Click here</Link> to view on explorer</p>
              </div>
            )
          })
        }).catch((e) => {
          modalStore.showModal({
            title: `It may take a while to received on ${targetChain.chainName}, please check later`,
            body: e.message ?? e.toString()
          })
        }).finally(()=>{
          setSending(false)
          getUsdcBalance({chainID: sourceChain?.chainID, address: cosmosAddrConvertor(sender, sourceChain.prefix)}).then(balance => {
            balanceStore.addUsdcBalance({chainID: sourceChain?.chainID, balance, address: sender})
          })
        })
        return
      }
      setSending(false)
      modalStore.showModal({
        title: `❌ Failed to send from ${sourceChain.chainName} to ${targetChain.chainName}`,
        body: (
          <div>
            <p>{res.rawLog ?? res.toString()}</p>
            <p><Link href={`${sourceChain?.explorer}/transactions/${res.transactionHash}`} target="_blank">Click here</Link> to view on explorer</p>
          </div>
        )
      })
    }).catch((e) => {
      console.error(`send to ${targetChain.chainName} error`, e)
      setSending(false)
      modalStore.showModal({
        title: `❌ Failed to send from ${sourceChain.chainName} to ${targetChain.chainName}`,
        body: e.message ?? e.toString()
      })
    })
  }

  return (
    <>
      <Button color="success"
        onClick={handleSendIbc}
        disabled={sending || disabled}
      >
        IBC to {targetChain?.chainName}
        {sending&&<Spinner size="sm" color="default"/>}
      </Button>
      {sourceChain.chainID==='noble-1'&&<p className="text-sm text-gray-500 mt-1">
        Gas fee: less than {nobleFee} USDC
      </p>}
    </>
  )
})