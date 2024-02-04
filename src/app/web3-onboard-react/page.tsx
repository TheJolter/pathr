'use client'

import { Button } from "@nextui-org/react"
import { useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import metamaskSDK from '@web3-onboard/metamask'
import {CommunicationLayerPreference} from '@metamask/sdk-communication-layer'

export default function Web3OnboardReact() {
  const [
    {
      wallet, // the wallet that has been connected or null if not yet connected
      connecting // boolean indicating if connection is in progress
    },
    connect, // function to call to initiate user to connect wallet
    disconnect, // function to call with wallet<DisconnectOptions> to disconnect wallet
    updateBalances, // function to be called with an optional array of wallet addresses connected through Onboard to update balance or empty/no params to update all connected wallets
    setWalletModules, // function to be called with an array of wallet modules to conditionally allow connection of wallet types i.e. setWalletModules([ledger, trezor, injected])
    setPrimaryWallet // function that can set the primary wallet and/or primary account within that wallet. The wallet that is set needs to be passed in for the first parameter and if you would like to set the primary account, the address of that account also needs to be passed in
  ] = useConnectWallet()

  // setWalletModules([
  //   injectedModule(),
  //   metamaskSDK({options: {
  //     dappMetadata: { // required to connect metamask app on mobile browser
  //       name: 'Pathr',
  //       url: `${location.protocol}//${location.host}`,
  //       // base64Icon: `${location.protocol}//${location.host}/favicon.ico`,
  //     }
  //   }})
  // ])

  return (
<div className="flex flex-col items-center justify-center min-h-screen">
  {connecting&&<div>connecting...</div>}
  <Button className="mt-2" onClick={()=>{
    connect().then(walletStates=>{
      console.log('walletStates', walletStates)
    })
  }}>Connect</Button>

  <Button className="mt-2" onClick={()=>{
    console.log('wallet', wallet)
  }}>Wallet</Button>

  <Button className="mt-2" onClick={()=>{
    disconnect({label: 'label'}).then(res=>{
      console.log('disconnect res', res)
    }).catch(err=>{
      console.error('disconnect err', err)
    })
  }}>Disconnect</Button>
</div>
  )
}