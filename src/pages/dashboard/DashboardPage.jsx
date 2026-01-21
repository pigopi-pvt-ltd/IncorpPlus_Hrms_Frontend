import { useAuth } from "../../contexts/AuthContext"
import MainLayout from "../../components/layout/MainLayout"
import {
  Users,
  Building,
  TrendingUp,
  Clock,
  DollarSign,
  Calendar,
  FileText,
  UserCheck,
  Activity,
  ChevronRight,
  BarChart3,
  Target,
  Award,
  MessageCircle,
  Eye,
  EyeOff,
  Download,
  Filter,
  MoreHorizontal,
} from "lucide-react"

const DashboardPage = () => {
  const { user, role, isGlobalAdmin, isSuperAdmin, isHR, isEmployee } =
    useAuth()

  const renderGlobalAdminDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-emerald-100">
            Here's what's happening with your HRMS platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Organizations
                </p>
                <p className="text-3xl font-bold text-slate-900">12</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Building className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">+12%</span>
              <span className="text-sm text-slate-500 ml-1">
                from last month
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-slate-900">1,247</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">+8.2%</span>
              <span className="text-sm text-slate-500 ml-1">
                from last month
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  System Health
                </p>
                <p className="text-3xl font-bold text-slate-900">98%</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">+2%</span>
              <span className="text-sm text-slate-500 ml-1">
                from last month
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Revenue</p>
                <p className="text-3xl font-bold text-slate-900">$45,231</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">+15%</span>
              <span className="text-sm text-slate-500 ml-1">
                from last month
              </span>
            </div>
          </div>
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-slate-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Performance Overview
              </h3>
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <MoreHorizontal className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            <div className="h-64 bg-white rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
                <p className="text-slate-500">
                  Performance chart visualization
                </p>
                <p className="text-sm text-slate-400">Coming soon</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Recent Activity
              </h3>
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <MoreHorizontal className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 hover:bg-slate-100 rounded-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    New organization created
                  </p>
                  <p className="text-xs text-slate-500">
                    Acme Corp • 2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 hover:bg-slate-100 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    User registration
                  </p>
                  <p className="text-xs text-slate-500">
                    john@example.com • 4 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 hover:bg-slate-100 rounded-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    System update
                  </p>
                  <p className="text-xs text-slate-500">
                    v2.1.0 deployed • 6 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 hover:bg-slate-100 rounded-lg">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    Security scan
                  </p>
                  <p className="text-xs text-slate-500">
                    Completed • 1 day ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organizations Table Preview */}
        <div className="bg-slate-50 rounded-xl shadow-sm">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Top Organizations
              </h3>
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-slate-100 rounded-lg">
                  <Filter className="h-4 w-4 text-slate-500" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg">
                  <Download className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6 pt-4">
            <div className="space-y-4">
              {[
                {
                  name: "Acme Corporation",
                  users: "245",
                  status: "Active",
                  growth: "+12%",
                },
                {
                  name: "Tech Solutions",
                  users: "189",
                  status: "Active",
                  growth: "+8%",
                },
                {
                  name: "Global Industries",
                  users: "312",
                  status: "Active",
                  growth: "+15%",
                },
                {
                  name: "Innovation Labs",
                  users: "98",
                  status: "Active",
                  growth: "+5%",
                },
                {
                  name: "Enterprise Group",
                  users: "456",
                  status: "Active",
                  growth: "+22%",
                },
              ].map((org, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg flex items-center justify-between p-4 hover:bg-slate-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Building className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{org.name}</p>
                      <p className="text-sm text-slate-500">
                        {org.users} users
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="text-sm text-slate-500">{org.status}</span>
                    <span className="text-sm font-medium text-green-600">
                      {org.growth}
                    </span>
                    <button className="p-1 hover:bg-slate-100 rounded">
                      <Eye className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getDashboardContent = () => {
    if (isGlobalAdmin()) {
      return renderGlobalAdminDashboard()
    } else if (isSuperAdmin()) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Super Admin Dashboard
          </h2>
          <p className="text-slate-600">
            Dashboard content for Super Admin users
          </p>
        </div>
      )
    } else if (isHR()) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            HR Dashboard
          </h2>
          <p className="text-slate-600">Dashboard content for HR users</p>
        </div>
      )
    } else {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Employee Dashboard
          </h2>
          <p className="text-slate-600">Dashboard content for Employee users</p>
        </div>
      )
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6">{getDashboardContent()}</div>
    </MainLayout>
  )
}

export default DashboardPage
