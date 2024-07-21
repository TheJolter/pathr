import { chains } from "@/components/USDC/chains"
import { ethers } from "ethers"
import cosmosAddrConvertor from "./cosmosAddrConvertor"

export default function getUsdcBalance({
  chainID,
  address
}:{
  chainID: string,
  address: string
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const chian = chains.find(chain => chain.chainID === chainID)
    if (!chian) {
      reject(new Error(`Chain not found`))
      return
    }
    if (chian.chainType === 'evm') {
      const provider = new ethers.providers.JsonRpcProvider(chian.rpc)
      const contract = new ethers.Contract(
        chian.usdcAddress, 
        ['function balanceOf(address) view returns(uint256)', 'function decimals() view returns(uint8)'], 
        provider
      )
      contract.balanceOf(address).then((balance:any)=>{
        resolve(ethers.utils.formatUnits(balance, 6))
      }).catch((error:any)=>{
        reject(error)
      })
      return
    }
    if (chian.chainType === 'cosmos') {
      fetch(`${chian.lcd}/cosmos/bank/v1beta1/balances/${cosmosAddrConvertor(address, chian.prefix)}`).then(res=>res.json()).then(({balances})=>{ // get [] for address with no balance
        resolve(ethers.utils.formatUnits(balances.find((item:any)=>item.denom===chian.usdcAddress)?.amount ?? '0', 6))
      }).catch(error=>{
        reject(error)
      })
      return
    }
  })
}