import { NextRequest, NextResponse } from "next/server";
import usdcPools from '@/configs/cctp/usdc-pools.json'
import ARBITRUM from '@/configs/cctp/uniswap/TopTokens/ARBITRUM.json'
import AVALANCHE from '@/configs/cctp/uniswap/TopTokens/AVALANCHE.json'
import BASE from '@/configs/cctp/uniswap/TopTokens/BASE.json'
import ETHEREUM from '@/configs/cctp/uniswap/TopTokens/ETHEREUM.json'
import OPTIMISM from '@/configs/cctp/uniswap/TopTokens/OPTIMISM.json'
import POLYGON from '@/configs/cctp/uniswap/TopTokens/POLYGON.json'
import { BlockchainInfo } from "@/configs/pathr/blockchain-info";

export async function GET(request:NextRequest) {
  const pools = [...ARBITRUM.data.topTokens, ...AVALANCHE.data.topTokens, ...BASE.data.topTokens, ...ETHEREUM.data.topTokens, ...OPTIMISM.data.topTokens, ...POLYGON.data.topTokens]

  const filteredPools = []
  for (const usdcPool of usdcPools) {
    const pool = pools.find(pool => pool.address.toLowerCase() === usdcPool.address.toLowerCase())
    filteredPools.push({
      "address": usdcPool.address,
      "name": pool?.name,
      "symbol": pool?.symbol,
      "blockchainNetwork": pool?.chain,
      "decimals": pool?.decimals,
      "image": pool?.project.logoUrl,
      "blockchainName": 'xxx'
    })
  }

  return NextResponse.json(usdcPools);
}
