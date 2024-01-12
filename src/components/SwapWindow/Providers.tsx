import Provider from "./Provider"
import {CircularProgress} from "@nextui-org/react"

export default function Providers(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
<div className={`w-[392px] min-h-[100px] rounded-xl py-4 px-6 ${props.className}`} 
  style={{...props.style}}
>
  <div className="flex items-center mb-4">
    <div className="grow font-semibold text-xl">You get</div>
    <CircularProgress className="text-[8px]" color="success" />
  </div>
  <Provider isBest />
  <Provider className="mt-4" />
  <Provider className="mt-4" />
  <Provider className="mt-4" />
</div>
  )
}