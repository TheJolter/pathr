import { NextRequest, NextResponse } from "next/server";
import allTokens from '@/configs/pathr/all-tokens.json'
import allTokensOld from '@/configs/pathr/all-tokens-old.json'

export async function GET(request:NextRequest) {

  let newAllTokens = allTokensOld
  for (const token of allTokens) {
    if ( !newAllTokens.find(item=>{
      return (
        item.address.toLowerCase()===token.address.toLowerCase()
        && item.blockchainName===token.blockchainName
      )
    })) {
      newAllTokens.push(token)
    }
  }

  return NextResponse.json(newAllTokens);
}
