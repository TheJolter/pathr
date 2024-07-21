import cosmosAddrConvertor from "./cosmosAddrConvertor"
import { chains, CosmosChain } from "@/components/USDC/chains"

const watchCosmosUsdcChange = ({
  chainID,
  address,
  timeoutSecond = 300, // second
  direction='inc'
}:{
  chainID: string,
  address: string,
  timeoutSecond?: number, // seconds
  direction?: 'inc'|'desc'
}): Promise<{newBalance: string}> => {
  const chain = chains.find(c => c.chainID === chainID) as CosmosChain
  const denom = chain.usdcAddress
  const fetchUrl = `${chain.lcd}/cosmos/bank/v1beta1/balances/${cosmosAddrConvertor(address, chain.prefix)}`
  return new Promise(async (resolve, reject) => {
    let oldAmount = '0'
    try {
      oldAmount = (await (await fetch(fetchUrl)).json()).balances?.find((b: any) => b.denom === denom)?.amount ?? '0'
    } catch(err) {
      reject(err)
      return
    }
    let counter = 0
    const invervalTime = 6000 // ms

    await fetchBalance()
    
    async function fetchBalance() {
      if ( counter*invervalTime > timeoutSecond*1000 ) {
        reject(new Error(`timeout ${timeoutSecond}s`))
        return
      }
      if (counter === 0) {
        await new Promise((resolve) => setTimeout(resolve, invervalTime))
      }
      counter ++
      try {
        const newAmount = (await (await fetch(fetchUrl)).json()).balances?.find((b: any) => b.denom === denom)?.amount ?? '0'
        if (
          (direction==='inc' && Number(newAmount) > Number(oldAmount))
          || (direction==='desc' && Number(newAmount) < Number(oldAmount))
        ) {
          resolve({newBalance: newAmount})
          return
        }
        setTimeout(fetchBalance, invervalTime)
      } catch(err) {
        setTimeout(fetchBalance, invervalTime)
      }
    }
  })
}

export default watchCosmosUsdcChange;