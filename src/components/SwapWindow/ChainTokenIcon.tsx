import { Avatar, Badge } from "@nextui-org/react";

export default function ChainTokenIcon() {
  return (
<Badge
  isOneChar
  content='E'
  placement="bottom-right"
  className="text-[8px] h-3 w-3"
  size="sm"
>
  <Avatar name="E" className="w-8 h-8 text-large" />
</Badge>
  )
}