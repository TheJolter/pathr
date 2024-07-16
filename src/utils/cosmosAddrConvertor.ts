import { bech32 } from "bech32";
import isCosmosAddress from "./isCosmosAddress";
// only suitable for 118 type address
export default function cosmosAddrConvertor(oldAddress: string, newHrp: string): string {
  if (!isCosmosAddress({address: oldAddress})) return ''
  const { words } = bech32.decode(oldAddress);
  return bech32.encode(newHrp, words);
}