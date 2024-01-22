'use client'

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Badge, Avatar, Button } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function ToggleButton(props: {
  onClick?: () =>void
}) {
  const {onClick} = props
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
<Button isIconOnly size="md" radius="full"
  className="border-[#35593F] border-1 pointer-events-auto"
  style={{background}}
  onClick={onClick}
>
  <FontAwesomeIcon icon='arrow-right-arrow-left' size="lg" />
</Button>
  )
}