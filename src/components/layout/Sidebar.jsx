import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import {
  Home,
  Users,
  User,
  UserPlus,
  Building,
  FileText,
  Calendar,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Briefcase,
  CreditCard,
  Mail,
  Layers,
  PieChart,
  UsersRound,
} from "lucide-react"

const Sidebar = ({ onCollapseChange }) => {
  const [localCollapsed, setLocalCollapsed] = useState(false)
  const { user, role, isGlobalAdmin, isSuperAdmin, isHR, isEmployee } =
    useAuth()
  const location = useLocation()

  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(localCollapsed)
    }
  }, [localCollapsed, onCollapseChange])

  const toggleSidebar = () => {
    setLocalCollapsed(!localCollapsed)
  }

  // Define navigation items based on roles
  const getNavItems = () => {
    const commonItems = [{ icon: Home, label: "Dashboard", path: "/dashboard" }]

    const adminItems = [
      { icon: Building, label: "Organizations", path: "/admin/organizations" },
      { icon: Users, label: "All Users", path: "/admin/users" },
      {
        icon: FileText,
        label: "Document Requirements",
        path: "/admin/document-requirements",
      },
      { icon: Settings, label: "System Settings", path: "/admin/settings" },
      { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
      { icon: PieChart, label: "Reports", path: "/admin/reports" },
    ]

    const superAdminItems = [
      {
        icon: UserPlus,
        label: "Register HR",
        path: "/super-admin/register-hr",
      },
      { icon: Users, label: "Manage Users", path: "/super-admin/users" },
      {
        icon: Building,
        label: "Organization",
        path: "/super-admin/organization",
      },
      {
        icon: FileText,
        label: "Document Requirements",
        path: "/super-admin/document-requirements",
      },
      { icon: BarChart3, label: "Reports", path: "/super-admin/reports" },
      { icon: PieChart, label: "Analytics", path: "/super-admin/analytics" },
    ]

    const hrItems = [
      {
        icon: UserPlus,
        label: "Register Employee",
        path: "/hr/register-employee",
      },
      { icon: UsersRound, label: "Employee Management", path: "/hr/employees" },
      { icon: DollarSign, label: "Payroll", path: "/hr/payroll" },
      { icon: Calendar, label: "Leave Requests", path: "/hr/leave-requests" },
      { icon: FileText, label: "Reports", path: "/hr/reports" },
      { icon: Briefcase, label: "Performance", path: "/hr/performance" },
    ]

    const employeeItems = [
      { icon: User, label: "My Profile", path: "/employee/profile" },
      { icon: Calendar, label: "Apply Leave", path: "/employee/apply-leave" },
      { icon: FileText, label: "My Documents", path: "/employee/documents" },
      { icon: DollarSign, label: "Salary Slip", path: "/employee/salary" },
      { icon: CreditCard, label: "Benefits", path: "/employee/benefits" },
      { icon: Mail, label: "Messages", path: "/employee/messages" },
    ]

    let items = [...commonItems]

    if (isGlobalAdmin()) {
      items = [...items, ...adminItems]
    } else if (isSuperAdmin()) {
      items = [...items, ...superAdminItems]
    } else if (isHR()) {
      items = [...items, ...hrItems]
    } else if (isEmployee()) {
      items = [...items, ...employeeItems]
    }

    return items
  }

  const navItems = getNavItems()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <aside
      className={`${
        localCollapsed ? "w-16" : "w-64"
      } bg-background text-foreground h-screen fixed left-0 top-0 transition-all duration-300 z-40 shadow-sm`}
    >
      <div className="flex flex-col h-full">
        {/* Logo/Header - no border */}
        <div
          className={`flex items-center ${
            localCollapsed ? "justify-center" : "justify-between"
          } p-4`}
        >
          {!localCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  HRMS
                </h1>
                <p className="text-xs text-muted-foreground">Human Resource</p>
              </div>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {localCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Navigation - no border */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center ${
                      localCollapsed ? "justify-center" : ""
                    } px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-emerald-100 text-emerald-800 shadow-inner"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon size={20} className={localCollapsed ? "" : "mr-3"} />
                    {!localCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Info - no border */}
        <div className={`p-4 ${localCollapsed ? "hidden" : "block"}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center shadow-md">
              <User size={16} className="text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.firstName}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">
                {role?.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
