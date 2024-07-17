import { Avatar, Badge } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import allTokens from '@/configs/pathr/all-tokens.json'
import { BlockchainInfo } from "@/configs/pathr/blockchain-info";
import getTokenImg from "@/utils/get-token-img";

export default observer(function ChainTokenIcon(props: {
  chainName: string,
  tokenAddr: string
}) {
  const {chainName, tokenAddr} = props
  const tokenInfo = allTokens.find(item=>{return item.address===tokenAddr&&item.blockchainName===chainName})
  const chainInfo = BlockchainInfo[chainName]
  const tokenImg = getTokenImg({chainID: BlockchainInfo[chainName]?.id, tokenAddress: tokenAddr})
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
    src={tokenImg}
    onError={(event) => {
      const target = event.target as HTMLImageElement;
      target.onerror = null;
      target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/1200px-Icon-round-Question_mark.svg.png'
    }}
  />}
</Badge>
  )
})