
import { CHAINS } from "@/configs/cctp/configs"
import ApiDataStore from "@/stores/ApiDataStore"

export type CoingeckoToken = {
  "chainId": number,
  "address": string,
  "name": string,
  "symbol": string,
  "decimals": number,
  "logoURI": string
}

export default function getAndStoreCoingeckoTokens({apiDataStore}: {apiDataStore: ApiDataStore}): Promise<CoingeckoToken[]> {
  return new Promise(async (resolve)=>{
    let allTokens:CoingeckoToken[] = []
    for (const {coingeckoApiId} of CHAINS) {
      if (!coingeckoApiId) continue
      try {
        const tokens = (await (await fetch(`https://tokens.coingecko.com/${coingeckoApiId}/all.json`)).json()).tokens as CoingeckoToken[]
        allTokens.push(...tokens)
      } catch(e) {}
    }
    apiDataStore.setCoingeckoTokens(allTokens)
    resolve(allTokens)
  })
}