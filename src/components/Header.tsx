import MainButton from "./MainButton"
import { ThemeSwitcher } from "./ThemeSwitcher"
import Logo from "./Logo/Logo"
import Menu from "./Menu"
import EvmWalletButton from "./EvmWalletButton/EvmWalletButton"

export default function Header() {
  return (
<div className="grid grid-cols-3 mt-3 mx-7">
  <div><Logo /></div>
  <Menu />
  <div className="flex items-center justify-end">
    <EvmWalletButton />
    <ThemeSwitcher />
  </div>
</div>
  )
}