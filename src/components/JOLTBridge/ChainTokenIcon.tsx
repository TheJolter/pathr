import { Avatar, Badge } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import allTokens from '@/configs/pathr/all-tokens.json'
import { BlockchainInfo } from "@/configs/pathr/blockchain-info";
import getTokenImg from "@/utils/get-token-img";

export default observer(function ChainTokenIcon(props: {
  tokenImg: string,
  chainImg: string
}) {
  const {tokenImg, chainImg} = props
  return (
<Badge
  isOneChar
  content={<>
    <img src={chainImg} alt="" />
  </>}
  placement="bottom-right"
  className="text-[8px] h-3 w-3"
  size="sm"
>
  <img alt="" width='32px' height='32px' className='rounded-full'
    src={tokenImg}
    onError={(event) => {
      const target = event.target as HTMLImageElement;
      target.onerror = null;
      target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/1200px-Icon-round-Question_mark.svg.png'
    }}
  />
</Badge>
  )
})