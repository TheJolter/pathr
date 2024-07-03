import { Token } from "@uniswap/sdk-core";
import { CHAINS } from "@/configs/cctp/configs";

export function isUsdc(token: Token) {
  const chain = CHAINS.find(chain=>chain.chainId===token.chainId)
  if (!chain) return false
  return chain.usdc.toLowerCase() === token.address.toLowerCase()
}