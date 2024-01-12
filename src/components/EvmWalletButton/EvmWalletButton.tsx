'use client'

/**
 * show fartawasome wallet icon if connected
 * if click after connected, show dropdown logout button
 */

import MainButton from "../MainButton";

export default function EvmWalletButton() {
  return (
<MainButton className="mr-4 h-[50px] text-lg">Connect Wallet</MainButton>
  )
}