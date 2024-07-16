import { normalizeBech32 } from '@cosmjs/encoding'

export default function isCosmosAddress({address, prefix}: {
  address: string,
  prefix?: string
}): boolean {
  try {
    normalizeBech32(address)
    if (prefix) return address.startsWith(prefix)
    return true
  } catch(e) {
    return false
  }
}