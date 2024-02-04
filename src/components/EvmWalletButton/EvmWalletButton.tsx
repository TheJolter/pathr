'use client'

import { useStore } from "@/stores/hooks";
import { observer } from "mobx-react-lite";
import connectEvmWallet from "@/utils/connectEvmWallet";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import MainButton from "../MainButton";
import { useEffect } from "react";
import getAndStoreBalances from "@/utils/get-and-store-balances";
import { useTheme } from "next-themes";
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets'
import metamaskSDK from '@web3-onboard/metamask'
import transactionPreviewModule from '@web3-onboard/transaction-preview'
import {Chain} from '@web3-onboard/common'
import { BlockchainInfo } from "@/configs/rubic/blockchain-info";

export default observer(function EvmWalletButton() {

  const evmWalletStore = useStore('evmWalletStore')
  const balanceStore = useStore('balanceStore')
  const { theme } = useTheme()
  const injected = injectedModule()
  const metamaskSDKWallet = metamaskSDK({options: {
    dappMetadata: { // required to connect metamask app on mobile browser
      name: 'Pathr',
      url: 'https://app.pathr.io/' // can not use `${location.protocol}//${location.host}`
    }
  }})
  const transactionPreview = transactionPreviewModule({})

  let chains:Chain[] = []
  for (const key in BlockchainInfo) {
    chains.push({id: `0x${BlockchainInfo[key].id.toString(16)}`})
  }

  const onboard = Onboard({
    transactionPreview,
    theme: theme==='dark'?'dark':'light',
    wallets: [
      injected,
      metamaskSDKWallet, // after injected, to use extenstion first on browser, if extenstion not exits, use SDK
    ],
    chains
  })

  useEffect(()=>{
    if (!evmWalletStore.address) return
    if (balanceStore.fetchedAddresses.includes(evmWalletStore.address)) return
    getAndStoreBalances({balanceStore, account: evmWalletStore.address})
  }, [evmWalletStore.address, balanceStore])

  useEffect(()=>{
    if (evmWalletStore.lastWeb3OnboardDate>0) {
      handleConnect()
    }
  }, [evmWalletStore.lastWeb3OnboardDate])

  function handleConnect() {
    onboard.connectWallet().then(connectedWallets=>{
      console.log('connectedWallets', connectedWallets)
      evmWalletStore.setWeb3OnboardWallets(connectedWallets)
      evmWalletStore.login(connectedWallets[0]?.accounts?.[0]?.address)
      const provider = connectedWallets[0].provider
      console.log('provider.chainId', (provider as any).chainId)
      // swatchChain(1)
    })
  }

  function swatchChain(chainId: string|number) {
    onboard.setChain({chainId})
  }

  return (
<>
  {!evmWalletStore.address&&<MainButton className="h-[50px] text-lg"
    onClick={()=>{
      // connectEvmWallet({evmWalletStore})
      handleConnect()
    }}
  >
    {formatEvmAddr(evmWalletStore.address)||'Connect Wallet'}
  </MainButton>}

  {evmWalletStore.address&&<Dropdown>
    <DropdownTrigger>
      <Button radius="full" className="mr-4 h-[50px] text-lg"
        style={{
          background: 'linear-gradient(90deg, #32CA62 0%, #EAF83F 100%)',
          color: '#333333',
          fontWeight: 600
        }}
      >
        {formatEvmAddr(evmWalletStore.address)||'Connect Wallet'}
        <FontAwesomeIcon icon={faChevronDown} />
      </Button>
    </DropdownTrigger>
    <DropdownMenu>
      <DropdownItem onClick={()=>evmWalletStore.logout()}>
        Logout
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>}
</>
  )
})

export function formatEvmAddr(inputString: string|null) {
  if (!inputString) return null
  const firstPart = inputString.substring(0, 6);
  const lastPart = inputString.substring(inputString.length - 4);
  return `${firstPart}....${lastPart}`;
}