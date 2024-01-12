import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "@nextui-org/react"
import { CSSProperties } from "react"
import ToggleButton from "./ToggleButton"
import ChainTokenCard from "./ChainTokenCard"
import InputCard from "./InputCard"
import MainButton from "../MainButton"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"

export default observer(function Exchange(props: {
  style?: CSSProperties
}) {
  const inputStore = useStore('inputStore')
  return (
<div>
  <div style={props.style}
    className="w-[392px] min-h-[320px] rounded-xl px-6 pt-4" 
  >
    <div className="flex items-center">
      <div className="font-semibold text-2xl grow">Exchange</div>
      {/* <Button isIconOnly className="bg-opacity" size="md" radius="full">
        <FontAwesomeIcon icon={faArrowsRotate} spin size="lg" />
      </Button> */}
      <Button isIconOnly className="bg-opacity" size="md" radius="full">
        <FontAwesomeIcon icon={faBars} size="lg" />
      </Button>
    </div>

    <div className="relative">
      <div className="absolute z-10 text-center w-full top-7 pointer-events-none">
        <ToggleButton />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <ChainTokenCard />
        <ChainTokenCard />
      </div>
    </div>

    <InputCard className="my-4 p-4" />

    <MainButton fullWidth className="mb-4">Start Swapping</MainButton>
    
  </div>
</div>
  )
})