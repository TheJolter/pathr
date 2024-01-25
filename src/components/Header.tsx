import MainButton from "./MainButton"
import { ThemeSwitcher } from "./ThemeSwitcher"
import Logo from "./Logo/Logo"
import Menu from "./Menu"
import EvmWalletButton from "./EvmWalletButton/EvmWalletButton"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { Button } from "@nextui-org/react"

export default function Header() {
  return (
<div className="grid grid-cols-3 mt-3 mx-7">
  <div><Logo /></div>
  <Menu />
  <div className="flex items-center justify-end">
    <EvmWalletButton />
    <ThemeSwitcher />
    <Button isIconOnly radius="full" size="lg" className="ml-2"
      onClick={()=>open(`https://twitter.com/PathR_DeFi`)}
    >
      <FontAwesomeIcon icon={faTwitter} />
    </Button>
  </div>
</div>
  )
}