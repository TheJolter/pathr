import { nobleFee } from "@/components/USDC/config";
import { CosmosChain, chains } from "@/components/USDC/chains"
import { useStore } from "@/stores/hooks"
import { MsgTransferEncodeObject, SigningStargateClient } from "@cosmjs/stargate"
import { Keplr } from "@keplr-wallet/types"
import { Button, Link, Spinner } from "@nextui-org/react"
import { observer } from "mobx-react-lite"
import { useEffect, useState } from "react"
import bn from "@/utils/bn"
import { Decimal } from "@cosmjs/math" // "@cosmjs/stargate/node_modules/@cosmjs/math/build/decimal" // "@cosmjs/math"
import watchCosmosUsdcChange from "@/utils/watchCosmosTokenChange"
import cosmosAddrConvertor from "@/utils/cosmosAddrConvertor"
import getUsdcBalance from "@/utils/get-usdc-balance"
import { circle, cosmos, getSigningCircleClient } from "@/utils/codegen-circle"
import { ethers } from "ethers"
import { BACKEND_BASE_API_URL } from "@/configs/cctp/backend";
import { bigNumberCeil } from "@/utils/bigNumberCeilFloor";

export default observer(function JoltifyToEvm({
  disabled
}:{
  disabled?: boolean
}) {
  const inputStore = useStore('inputStore')
  const cosmosWalletStore = useStore('cosmosWalletStore')
  const modalStore = useStore('modalStore')
  const balanceStore = useStore('balanceStore')

  const targetChain = chains.find(chain => chain.chainID === inputStore.targetChainID)
  const sourceChain = chains.find(chain => chain.chainID === inputStore.sourceChainID) as CosmosChain
  const nobleChain = chains.find(chain => chain.chainID === 'noble-1') as CosmosChain
  

  const [sendingToNoble, setSendingToNoble] = useState(false)
  const [receivedOnNoble, setReceivedOnNoble] = useState(false)
  const [sendingToEvm, setSendingToEvm] = useState(false)
  const [param, setParam] = useState<any>()
  const [params, setParams] = useState<any>()
  // const [balanceNoble, setBalanceNoble] = useState('0') // base amount

  useEffect(()=>{
    fetch(`${BACKEND_BASE_API_URL}/api/params`).then(res=>res.json()).then(params=>{
      setParams(params)
      setParam(params.targetChains.find((item:any) => item.domain === targetChain?.domain))
    })
  }, [])

  useEffect(()=>{
    if ( !cosmosWalletStore.address ) return
    const address = cosmosAddrConvertor(cosmosWalletStore.address, 'noble')
    getUsdcBalance({chainID: 'noble-1', address}).then(balance => {
      balanceStore.addUsdcBalance({chainID: 'noble-1', balance, address})
    })
  }, [cosmosWalletStore.address])

  const resetStatus = () => {
    setSendingToNoble(false)
    setReceivedOnNoble(false)
    setSendingToEvm(false)
  }

  const handleSendToNoble = async () => {
    console.log('handleSendIbc')
    const keplr:Keplr = (window as any).keplr
    if (!cosmosWalletStore.address) {
      modalStore.showModal({ title: '⚠️', body: 'Please connect Keplr wallet first'})
      return
    }
    if (!keplr || !sourceChain || !cosmosWalletStore.address || Number(inputStore.amount)<=0) {
      console.log({keplr, sourceChain})
      return
    }
    const signer = keplr.getOfflineSignerOnlyAmino(sourceChain.chainID)
    setSendingToNoble(true)
    const sender = (await signer.getAccounts())[0].address
    // @ts-ignore
    const client = await SigningStargateClient.connectWithSigner(sourceChain.rpc, signer, {gasPrice: {amount: Decimal.fromUserInput('8000', 0), denom: sourceChain.nativeToken}})
    const gasFee = bn(nobleFee).times(1e6).toFixed(0)
    let amount = bn(inputStore.amount).times(1e6).toFixed(0)
    const msg:MsgTransferEncodeObject = {
      typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
      value: {
        sourcePort: "transfer",
        sourceChannel: sourceChain.chainID==='noble-1'?'channel-81':'channel-1',
        token: {denom: sourceChain.usdcAddress, amount},
        sender, 
        receiver: cosmosAddrConvertor(cosmosWalletStore.address!, 'noble'),
        timeoutTimestamp: BigInt((new Date().getTime()+10*60*1000)*1000000),
        memo: '', // can not be undefined
      }
    }
    console.log({msg})

    client.signAndBroadcast(sender, [msg], 'auto').then((res) => {
      console.log(res)
      if (res.code===0) {
        watchCosmosUsdcChange({chainID: 'noble-1', address: cosmosAddrConvertor(cosmosWalletStore.address!, 'noble'), timeoutSecond: 600})
        .then(({newBalance}) => {
          balanceStore.addUsdcBalance({
            chainID: 'noble-1', 
            balance: ethers.utils.formatUnits(newBalance, 6), 
            address: cosmosAddrConvertor(cosmosWalletStore.address!, 'noble')
          })
          setReceivedOnNoble(true)
          modalStore.showModal({
            title: 'USDC received on Noble',
            body: (
              <div>
                <p className="mb-2">Now you send to {targetChain?.chainName} by clicking this button:</p>
                <Button color="success" onClick={()=>{
                  handleSendToEvm()
                  modalStore.closeModal()
                }}>3. Send to {targetChain?.chainName}</Button>
              </div>
            )
          })
        }).catch((e) => {
          modalStore.showModal({
            title: `It may take a while to received on Noble, please check later`,
            body: e.message ?? e.toString()
          })
          resetStatus()
        }).finally(()=>{
          setSendingToNoble(false)
          // getUsdcBalance({chainID: sourceChain?.chainID, address: cosmosAddrConvertor(sender, sourceChain.prefix)}).then(balance => {
          //   balanceStore.addUsdcBalance({chainID: sourceChain?.chainID, balance, address: sender})
          // })
        })
        return
      }
      resetStatus()
      modalStore.showModal({
        title: `❌ Failed to send from ${sourceChain.chainName} to Noble`,
        body: (
          <div>
            <p>{res.rawLog ?? res.toString()}</p>
            <p><Link href={`${sourceChain?.explorer}/transactions/${res.transactionHash}`} target="_blank">Click here</Link> to view on explorer</p>
          </div>
        )
      })
    }).catch((e) => {
      console.error(`send to Noble error`, e)
      resetStatus()
      modalStore.showModal({
        title: `❌ Failed to send from ${sourceChain.chainName} to Noble`,
        body: e.message ?? e.toString()
      })
    })
  }

  const handleSendToEvm = async () => {
    const keplr:Keplr = (window as any).keplr
    if (!keplr || !cosmosWalletStore.address || !inputStore.targetAddress) return
    const {depositForBurn} = circle.cctp.v1.MessageComposer.withTypeUrl
    const {send} = cosmos.bank.v1beta1.MessageComposer.withTypeUrl
    const from = cosmosAddrConvertor(cosmosWalletStore.address!, 'noble')

    const cleanedMintRecipient = inputStore.targetAddress.replace(/^0x/, '');
    const zeroesNeeded = 64 - cleanedMintRecipient.length;
    const mintRecipient = '0'.repeat(zeroesNeeded) + cleanedMintRecipient;
    const buffer = Buffer.from(mintRecipient, "hex");
    const mintRecipientBytes = new Uint8Array(buffer)

    const gasFee = bn(nobleFee).times(1e6).toFixed(0)
    const routeFee = param?.fee || Infinity
    let amount = bn(inputStore.amount).times(10**6).toFixed(0)
    const balanceNoble = balanceStore.getUsdcBalance('noble-1', from)
    if (bn(amount).plus(gasFee).plus(routeFee).gt( bn(balanceNoble).times(10**6) )) {
      amount = bn(bn(balanceNoble).times(10**6)).minus(gasFee).minus(routeFee).toFixed(0)
    }

    const msg = depositForBurn({
      from,
      amount,
      destinationDomain: targetChain?.domain!, 
      mintRecipient: mintRecipientBytes,
      burnToken: 'uusdc',
    })
    const msgFee = send({
      fromAddress: from,
      toAddress: params.minter!,
      amount: [{denom: 'uusdc', amount: param?.fee??'0'}]
    })

    let client: SigningStargateClient
    setSendingToEvm(true)
    try {
      const signer = await keplr.getOfflineSignerAuto('noble-1') as any
      client = await getSigningCircleClient({rpcEndpoint: nobleChain?.rpc!, signer}) as unknown as SigningStargateClient
    } catch(error:any) {
      setSendingToEvm(false)
      modalStore.showModal({title: 'Error', body: error?.message??error.toString()})
      return
    }
    let fee = {amount: [{amount: '0', denom: 'uusdc'}], gas: '200000'}
    console.log({from, msgFee, msg})
    try {
      fee = {amount: [{amount: '0', denom: 'uusdc'}], gas:((await client.simulate(from, [msgFee, msg],''))*Number(2)).toString()}
    } catch(error:any) {
      console.error('simulate error', error)
      setSendingToEvm(false)
      modalStore.showModal({title: 'Error', body: error?.message??error.toString()})
      return
    }
    client.signAndBroadcast(from, [msgFee, msg], fee).then((res)=>{
      if (res.code !==0) {
        setSendingToEvm(false)
        modalStore.showModal({title: `❌ Error Send from Noble to ${targetChain?.chainName}`,
          body: (
            <div>
              <p>{res.rawLog}</p>
              <p><Link href={`${nobleChain?.explorer}/transactions/${res.transactionHash}`} target="_blank">Click here</Link> to view details on explorer</p>
            </div>
          )
        })
        return
      }

      let counter = 0
      getAttestationAndMintOnServer() // must after let counter = 0
      function getAttestationAndMintOnServer() {
        counter ++
        if (counter > 9999) {
          setSendingToEvm(false)
          modalStore.showModal({
            title: `Timeout to mint USDC on ${targetChain?.chainName}`,
            body: `Copy and save this url: ${nobleChain?.explorer}/transactions/${res.transactionHash} and contact us for help`
          })
          return
        }
        fetch(`https://iris-api.circle.com/v1/messages/4/${res.transactionHash}`)
        .then(res=>res.json()).then(({messages})=>{
          if (!messages || messages[0]?.attestation==='PENDING') {
            setTimeout(()=>{
              getAttestationAndMintOnServer()
            }, 6000)
            return
          }
          fetch(`${BACKEND_BASE_API_URL}/api/mint-on-evm`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages,
              transactionHash: res.transactionHash,
            })
          }).then(res=>res.json()).then((res)=>{
            if (res.status!==1) {
              modalStore.showModal({
                title: res.error ?? res.message ?? res.toString(), 
                body: `Copy and save this url: ${nobleChain?.explorer}/transactions/${res.transactionHash} and contact us for help`
              })
              return
            }
            resetStatus()
            modalStore.showModal({title: `✅ USDC Minted on ${targetChain?.chainName}`, 
              body: (
                <div>
                  <p><Link href={`${targetChain?.explorer}/tx/${res.hash}`} target="_blank">Click here</Link> to view details on explorer</p>
                </div>
              )
            })
          }).catch(error=>{
            modalStore.showModal({
              title: error?.message??error.toString(), 
              body: `Copy and save this url: ${nobleChain?.explorer}/transactions/${res.transactionHash} and contact us for help`
            })
          }).finally(()=>{
            setSendingToEvm(false)
          })
        })
      }
    }).catch((error)=>{
      setSendingToEvm(false)
      modalStore.showModal({title: 'Error', body: error?.message??error.toString()})
    })
  }

  return (
<div>
  <div className="grid grid-cols-3">
    <Button color={receivedOnNoble?'default':'success'}
      disabled={ 
        receivedOnNoble || sendingToNoble || disabled 
        || (cosmosWalletStore.isNanoLedger&&location.pathname!=='/test/amino')
      }
      onClick={handleSendToNoble}
    >
      1. Send to Noble
      {sendingToNoble&&<Spinner size="sm" color="default"/>}
    </Button>
    <div className={`flex items-center justify-center ${!receivedOnNoble&&'text-gray-500'}`}>2. Received on Noble</div>
    <Button color={receivedOnNoble?'success':'default'}
      disabled={!receivedOnNoble||sendingToEvm}
      onClick={handleSendToEvm}
    >
      3. Send to {targetChain?.chainName}
      {sendingToEvm&&<Spinner size="sm" color="default"/>}
    </Button>
  </div>
  <p className="text-sm text-gray-500 mt-1">
    Gas fee: less than {nobleFee} USDC; Router fee: { bigNumberCeil(bn(param?.fee||0).div(10**6), 6).toFixed() } USDC
  </p>
  {!(cosmosWalletStore.isNanoLedger&&location.pathname!=='/test/amino')&&
    <p className="text-orange-600 text-xl mt-5">Please stay on this page during processing</p>
  }
  {(cosmosWalletStore.isNanoLedger&&location.pathname!=='/test/amino')&&
    <p className="text-orange-600 text-xl mt-5">The route does not work with Ledger yet.</p>
  }
</div>
  )
})