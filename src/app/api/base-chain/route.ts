import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {

  const {tokens} = await (await fetch('https://tokens.coingecko.com/base/all.json')).json()

  let formattedTokens = []
  for (const token of tokens) {
    formattedTokens.push({
      "address": token.address,
      "name": "Liquid staked Base 2.0",
      "symbol": token.symbol,
      "blockchainNetwork": "base",
      "decimals": token.decimals,
      "image": token.logoURI,
      "blockchainName": "BASE"
    })
  }

  return NextResponse.json(formattedTokens, { status: 200 });
}
