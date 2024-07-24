import { NextRequest, NextResponse } from "next/server";
import allTokens from '@/configs/pathr/all-tokens.json'

export async function GET(request:NextRequest) {

  let tokens: {symbol: string, img?: string, chains: {blockchainName:string}[]}[] = [
    {
      symbol: 'JOLT', 
      img: 'https://assets.rubic.exchange/assets/binance-smart-chain/0x7db21353a0c4659b6a9a0519066aa8d52639dfa5/logo.png',
      chains: [{blockchainName:'BSC'}]
    }
  ]
  for (const token of allTokens) {
    if (tokens.find(item=>item.symbol.toLowerCase()===token.symbol.toLowerCase())) {
      if (tokens.find(item=>item.symbol.toLowerCase()===token.symbol.toLowerCase())?.chains.find(item=>item.blockchainName===token.blockchainName)) continue
      tokens.find(item=>item.symbol.toLowerCase()===token.symbol.toLowerCase())?.chains.push({blockchainName: token.blockchainName})
      continue
    }
    if (!allTokens.find(item=>{
      return (
        item.symbol.toLowerCase()===token.symbol.toLowerCase() 
        && item.blockchainName!==token.blockchainName
      )
    })) continue
    tokens.push({
      symbol: token.symbol,
      img: token.image,
      chains: [{blockchainName: token.blockchainName}]
    })
  }

  return NextResponse.json(tokens);
}
