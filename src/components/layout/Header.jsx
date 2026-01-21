import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  User,
  LogOut,
  Settings,
  Bell,
  Menu,
  ChevronDown,
  CreditCard,
  HelpCircle,
  LifeBuoy,
  Shield,
  Key,
  UserCog,
  Building2,
} from "lucide-react"

const Header = ({ toggleSidebar }) => {
  const { user, logout, role } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
      {/* Left side - Menu toggle and breadcrumbs */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">HRMS</h1>
          {role && (
            <Badge variant="secondary" className="ml-2 capitalize">
              {role.replace("_", " ")}
            </Badge>
          )}
        </div>
      </div>

      {/* Right side - Notifications and user menu */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full flex items-center justify-center text-[8px] text-white">
            3
          </span>
        </Button>

        {/* Help button */}
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-5 w-5 text-foreground" />
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full ring-1 ring-slate-200 hover:ring-emerald-300 transition-all"
            >
              <Avatar className="h-9 w-9 ring-1 ring-slate-200">
                <AvatarImage
                  src={`/avatars/${user?.email || "user"}.jpg`}
                  alt={user?.firstName}
                />
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-60 bg-white border border-slate-200 shadow-lg rounded-xl p-2"
            align="end"
            forceMount
          >
            <div className="p-3 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg -m-2 -mt-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-slate-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-slate-600">
                    {user?.email}
                  </p>
                  <Badge
                    variant="secondary"
                    className="w-fit mt-1 capitalize bg-emerald-100 text-emerald-700 border-emerald-200"
                  >
                    {role?.toLowerCase().replace("_", " ")}
                  </Badge>
                </div>
              </DropdownMenuLabel>
            </div>

            <DropdownMenuItem className="py-2.5 my-1">
              <User className="mr-2 h-4 w-4 text-slate-500" />
              <span className="text-slate-700">Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="py-2.5 my-1">
              <Building2 className="mr-2 h-4 w-4 text-slate-500" />
              <span className="text-slate-700">Organization</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="py-2.5 my-1">
              <Shield className="mr-2 h-4 w-4 text-slate-500" />
              <span className="text-slate-700">Security</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-slate-100" />

            <DropdownMenuItem className="py-2.5 my-1">
              <Settings className="mr-2 h-4 w-4 text-slate-500" />
              <span className="text-slate-700">Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="py-2.5 my-1">
              <Key className="mr-2 h-4 w-4 text-slate-500" />
              <span className="text-slate-700">Account</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-slate-100" />

            <DropdownMenuItem className="py-2.5 my-1">
              <LifeBuoy className="mr-2 h-4 w-4 text-slate-500" />
              <span className="text-slate-700">Support</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-slate-100" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="py-2.5 my-1 text-destructive focus:bg-red-50 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Header
