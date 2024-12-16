import { Home, MessageCircleCode, Search } from "lucide-react";
import { Separator } from "./ui/separator";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme/theme-toggle";
import { AccountMenu } from "./account-menu";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <MessageCircleCode className="h-6 w-6" />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <Home className="h-5 w-5" />
            Início
          </NavLink>
          <NavLink to="/search">
            <Search className="h-5 w-5" />
            Pesquisar
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          <AccountMenu />
        </div>
      </div>
    </div>
  )
}