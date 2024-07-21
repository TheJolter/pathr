import { ethers } from 'ethers'
const { bech32 } = require('bech32')

// only support cosmos address of 118 type
export default function getMintRecipientFromCosmosAddress(nobleAddress: string) {
  const numberArray = bech32.fromWords(bech32.decode(nobleAddress).words)
  const mintRecipientBytes = new Uint8Array(32)
  mintRecipientBytes.set(numberArray, 32 - numberArray.length)
  return ethers.hexlify(mintRecipientBytes)
}