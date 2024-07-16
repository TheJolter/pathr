'use client'

import { useStore } from "@/stores/hooks";
import { observer } from "mobx-react-lite";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import MainButton from "../MainButton";
import { useEffect } from "react";
import getAndStoreBalances from "@/utils/get-and-store-balances";
import { useConnectWallet, init } from '@web3-onboard/react'

export default observer(function EvmWalletButton() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const address = wallet?.accounts?.[0]?.address

  const balanceStore = useStore('balanceStore')

  useEffect(()=>{
    if (!address) return
    if (balanceStore.fetchedAddresses.includes(address)) return
    getAndStoreBalances({balanceStore, account: address})
  }, [address, balanceStore])

  function handleConnect() {
    const node = document.querySelector('onboard-v2') as HTMLElement
    if (node) node.style.display = 'block'
    connect().then(()=>{
      if (node) node.style.display = 'none'
    })
  }

  async function swatchChain(chainId: string|number) {
    try {
      const result = await wallet?.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }], // chainId must be in hexadecimal numbers
      });
      console.log(`result: `, result)
    } catch (err: unknown) {
      const error = err as any;
      console.log(typeof error)
      console.log(error);
      if (error.code === -32603 || error.code === 4902) {
        const confirmation = document.getElementById('confirmation');
        confirmation!.style.display = 'block';
      }
    }
  }

  return (
<>
  {!address&&<Button color="warning"
    // className="h-[50px] text-lg"
    onClick={()=>{
      // connectEvmWallet({evmWalletStore})
      handleConnect()
    }}
  >
    {formatEvmAddr(address||'')||'Connect Metamask'}
  </Button>}

  {address&&<Dropdown>
    <DropdownTrigger>
      <Button color="warning"
        // radius="full" className="mr-4 h-[50px] text-lg"
        // style={{
        //   background: 'linear-gradient(90deg, #32CA62 0%, #EAF83F 100%)',
        //   color: '#333333',
        //   fontWeight: 600
        // }}
      >
        {formatEvmAddr(address)||'Connect Metamask'}
        <FontAwesomeIcon icon={faChevronDown} />
      </Button>
    </DropdownTrigger>
    <DropdownMenu>
      <DropdownItem onClick={()=>disconnect(wallet)}>
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