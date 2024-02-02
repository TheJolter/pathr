'use client'

import { Button } from '@nextui-org/react'
import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import metamaskSDK from '@web3-onboard/metamask'
import { useTheme } from 'next-themes'


export default function Web3onboard() {
  const { theme } = useTheme()
  const injected = injectedModule()
  const metamaskSDKWallet = metamaskSDK({options: {}})
  const onboard = Onboard({
    theme: theme==='dark'?'dark':'light',
    wallets: [injected, metamaskSDKWallet],
    chains: [
      {
        id: 56,
        token: 'BNB',
        label: 'BSC',
        rpcUrl: 'https://bsc-dataseed1.binance.org'
      }
    ]
  })

  function handleConnect() {
    onboard.connectWallet().then(connectedWallets=>{
      console.log('connectedWallets', connectedWallets)
    })
  }
  
  return (
<div className='flex flex-col items-center justify-center min-h-screen'>
  <Button onClick={handleConnect}>
    Connect EVM Wallet
  </Button>
</div>
  )
}