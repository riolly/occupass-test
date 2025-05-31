import { Link } from "@tanstack/react-router";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "../lib/utils";

export default function Header() {
  return (
    <header className="p-4 bg-primary text-white shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">
            <Link to="/" className="hover:text-blue-200">
              Customer & Orders Management
            </Link>
          </div>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/customers">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/20 data-[active]:text-white"
                    )}
                  >
                    Customers
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/orders">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/20 data-[active]:text-white"
                    )}
                  >
                    Orders
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}
