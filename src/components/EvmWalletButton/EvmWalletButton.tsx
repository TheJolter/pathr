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

export default observer(function EvmWalletButton() {

  const evmWalletStore = useStore('evmWalletStore')
  const balanceStore = useStore('balanceStore')

  useEffect(()=>{
    if (!evmWalletStore.address) return
    if (balanceStore.fetchedAddresses.includes(evmWalletStore.address)) return
    getAndStoreBalances({balanceStore, account: evmWalletStore.address})
  }, [evmWalletStore.address, balanceStore])

  return (
<>
  {!evmWalletStore.address&&<MainButton className="h-[50px] text-lg"
    onClick={()=>connectEvmWallet({evmWalletStore})}
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