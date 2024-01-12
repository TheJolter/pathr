import { Avatar, Button, Chip } from "@nextui-org/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import ChainTokenIcon from "./ChainTokenIcon"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faGasPump, faClock, faSackDollar } from '@fortawesome/free-solid-svg-icons'

export default function Provider(props: {
  className?: string,
  isBest?: boolean
}) {
  const {className, isBest} = props

  const { theme } = useTheme()

  const [background, setBackground] = useState('')

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
>
  {isBest&&<Chip size="sm" className="mb-3" color="success">Best</Chip>}

  <div className="flex items-center justify-between">
    <ChainTokenIcon />
    <div className="grow ml-4">
      <div className="text-lg font-semibold">123.456789 USDT</div>
      <div className="flex items-center text-gray-400 text-sm">
        <div className="mr-1">$123.45</div>
        <div className="mr-1">·</div>
        <Avatar className="w-4 h-4 mr-1" name="L" />
        <div>Lifi</div>
      </div>
    </div>
    {/* <Button isIconOnly className="rounded-full" size="sm">
      <FontAwesomeIcon icon={faAngleDown} />
    </Button> */}
  </div>
  <div className="flex items-center justify-between mt-4">
    <div className="flex items-center mr-4">
      <FontAwesomeIcon icon={faGasPump} className="text-gray-400 mr-2" />
      <div>$0.01</div>
    </div>
    <div className="flex items-center">
      <FontAwesomeIcon icon={faSackDollar} className="text-gray-400 mr-2" />
      <div>$0.01</div>
    </div>
    <div className="flex items-center grow justify-end">
      <FontAwesomeIcon icon={faClock} className="text-gray-400 mr-2" />
      <div>1m</div>
    </div>
  </div>
</div>
  )
}