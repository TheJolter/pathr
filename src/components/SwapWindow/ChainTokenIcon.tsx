import { Avatar, Badge } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import allTokens from '@/configs/rubic/all-tokens.json'
import { BlockchainInfo } from "@/configs/rubic/blockchain-info";

export default observer(function ChainTokenIcon(props: {
  chainName: string,
  tokenAddr: string
}) {
  const {chainName, tokenAddr} = props
  const tokenInfo = allTokens.find(item=>{return item.address===tokenAddr&&item.blockchainName===chainName})
  const chainInfo = BlockchainInfo[chainName]
  return (
<Badge
  isOneChar
  content={<>
    {!!chainInfo&&<img src={chainInfo?.chainLabel} alt="" />}
  </>}
  placement="bottom-right"
  className="text-[8px] h-3 w-3"
  size="sm"
>
  {!tokenInfo&&<Avatar name=" " className="w-8 h-8 text-large" />}
  {!!tokenInfo&&<img alt="" width='32px' height='32px' className='rounded-full'
    src={`https://assets.rubic.exchange/assets/${tokenInfo?.blockchainNetwork}/${tokenInfo?.address}/logo.png`}
  />}
</Badge>
  )
})