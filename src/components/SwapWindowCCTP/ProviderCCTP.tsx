import { Avatar, Chip, Tooltip } from "@nextui-org/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import ChainTokenIcon from "./ChainTokenIcon"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSackDollar } from '@fortawesome/free-solid-svg-icons'
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import { CHAINS } from "@/configs/cctp/configs"
import { bigNumberFloor } from "@/utils/bigNumberCeilFloor"

export default observer(function ProviderCCTP(props: {
  className?: string,
  isBest?: boolean,
  selected?: boolean,
}) {
  const {className, isBest, selected} = props

  const displayStore = useStore('displayStore')
  const pathrStore = useStore('pathrStore')
  const cctpStore = useStore('cctpStore')
  const apiDataStore = useStore('apiDataStore')
  const swapInfo = cctpStore.swapInfo

  const { theme } = useTheme()

  const [background, setBackground] = useState('')

  const targetChain =  CHAINS.find(chain=>chain.chainName===pathrStore.toChainName)
  let platformFee = apiDataStore.platformFees.find(fee=>fee.chainID===targetChain?.chainId)?.feeUSDC || '0'
  platformFee = bigNumberFloor(platformFee, 2).toFixed()

  useEffect(()=>{
    if (theme==='dark') {
      setBackground('#354439')
      return
    }
    setBackground('#ffffff')
  }, [theme])

  return (
<div style={{background}}
  className={`min-h-[64px] rounded-xl border-[#35593F] border-1 p-4 ${className} cursor-pointer`}
  onClick={()=>{
    displayStore.setShowPreview(true)
  }}
>
  {isBest&&<Chip size="sm" className="mb-3" color="success">Best</Chip>}

  {selected&&<div className="font-semibold mb-2">You get</div>}

  <div className="flex items-center justify-between">
    <ChainTokenIcon tokenAddr={pathrStore.toChainTokenAddr!} chainName={pathrStore.toChainName!} />
    <div className="grow ml-4">
      <div className="text-lg font-semibold">
        {swapInfo?.amountOut} {swapInfo?.tokenOut.symbol}
      </div>
      <div className="flex items-center text-gray-400 text-sm">
        <Avatar className="w-4 h-4 mr-1" src="https://uniswap.org/favicon.ico" />
        <div>
          Uniswap
        </div>
      </div>
    </div>
  </div>
  <div className="flex items-center justify-between mt-4">
    <div className="flex items-center mr-4">
      {/* <Tooltip content="Protocol Fee" showArrow>
        <FontAwesomeIcon icon={faSackDollar} className="text-gray-400 mr-2" />
      </Tooltip> */}
      <div className="text-gray-400">
        Fee: {(((swapInfo?.fee||0)+(swapInfo?.targetFee||0))*100).toFixed(2)}% + {platformFee} USDC
      </div>
    </div>
    <div className="flex items-center grow justify-end">
      <div className="text-gray-400">
        {/* Slippage: {((swapInfo?.slippage||0)*100).toFixed(2)}% */}
        Time: 3m
      </div>
    </div>
  </div>
</div>
  )
})