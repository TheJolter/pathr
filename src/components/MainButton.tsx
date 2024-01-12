import { Button, ButtonProps } from "@nextui-org/react"
import { CSSProperties } from "react"

export default function MainButton(props: ButtonProps) {
  const buttonStyle:CSSProperties = {
    background: 'linear-gradient(90deg, #32CA62 0%, #EAF83F 100%)',
    color: '#333333',
    fontWeight: 600
  }
  return (
<Button radius="full" {...props} style={{...buttonStyle, ...props.style}}
  className={`${props.className}`}
>
  {props.children}
</Button>
  )
}