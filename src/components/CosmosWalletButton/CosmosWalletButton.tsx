'use client'

import { useStore } from "@/stores/hooks";
import formatAddress from "@/utils/formatAddress";
import { Button } from "@nextui-org/react";
import { observer } from 'mobx-react-lite'
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
// import cosmosAddrConvertor from "@/utils/cosmosAddrConvertor";
import { useEffect } from "react";
import { Keplr } from "@keplr-wallet/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default observer(function CosmosWalletButton() {
  const cosmosWalletStore = useStore('cosmosWalletStore')

  const joltifyChainID = 'joltify_1729-1'

  const handleConnect = async () => {
    const keplr: Keplr = (window as any).keplr
    await keplr.enable(joltifyChainID)
    const offlineSigner = keplr.getOfflineSigner(joltifyChainID)

    console.log('offlineSigner', offlineSigner)

    const accounts = await offlineSigner.getAccounts()
    console.log('accounts', accounts)
    const address = accounts[0].address
    cosmosWalletStore.login(address, {
      isNanoLedger: (await keplr.getKey(joltifyChainID)).isNanoLedger
    })
  }

  const handleLogout = () => {
    cosmosWalletStore.logout()
  }

  useEffect(()=>{
    const keplr = (window as any).keplr
    if (!keplr) return
    window.addEventListener('keplr_keystorechange', handleKeplrKeystoreChange)
    return () => {
      window.removeEventListener('keplr_keystorechange', handleKeplrKeystoreChange)
    }
  }, [])

  const handleKeplrKeystoreChange = () => {
    if (!cosmosWalletStore.address) return
    handleLogout()
    handleConnect()
  }

  if (cosmosWalletStore.address) {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button color="primary">
            {/* Keplr Connected */}
            {formatAddress(cosmosWalletStore.address)}
            <FontAwesomeIcon icon={faChevronDown} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          {/* <DropdownItem>
            Joltify: {formatAddress(cosmosWalletStore.address)}
          </DropdownItem> */}
          {/* <DropdownItem>
            Noble: {formatAddress(cosmosAddrConvertor(cosmosWalletStore.address, 'noble'))}
          </DropdownItem> */}
          <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  } else {
    return (
      <Button color="primary" onClick={handleConnect}>
        Connect Keplr
      </Button>
    )
  }
})