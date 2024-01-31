import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import Logo from "./Logo/Logo";
import Menu from "./Menu";
import EvmWalletButton from "./EvmWalletButton/EvmWalletButton";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-transparent">
      <NavbarContent>
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent id="nav-menu" justify="center"
        className="hidden md:flex"
      >
        <Menu />
      </NavbarContent>

      <NavbarContent justify="end">
        <div className="flex items-center justify-end">
          <EvmWalletButton />
          <div className="hidden lg:flex items-center ml-2">
            <ThemeSwitcher />
            <Button isIconOnly radius="full" className="ml-2"
              onClick={()=>open(`https://twitter.com/PathR_DeFi`)}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </Button>
          </div>
        </div>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Menu />
        </NavbarMenuItem>
        {/* <NavbarMenuItem>
          <EvmWalletButton />
        </NavbarMenuItem> */}
        <NavbarMenuItem>
          <div className="flex items-center">
            <ThemeSwitcher />
            <Button isIconOnly radius="full" className="ml-2"
              onClick={()=>open(`https://twitter.com/PathR_DeFi`)}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </Button>
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
