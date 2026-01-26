import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  UserPlus,
  Building,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  MoreHorizontal,
  Activity,
  DollarSign,
  BarChart3,
} from "lucide-react"

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalHRManagers: 24,
    pendingRegistrations: 8,
    activeOrganizations: 12,
    totalEmployees: 1247,
    systemHealth: 98,
    revenue: 45231,
    recentActivities: [
      {
        id: 1,
        action: "New HR registration",
        user: "John Smith",
        time: "2 min ago",
        status: "pending",
      },
      {
        id: 2,
        action: "Organization created",
        org: "TechCorp Inc.",
        time: "15 min ago",
        status: "success",
      },
      {
        id: 3,
        action: "User approved",
        user: "Sarah Johnson",
        time: "1 hour ago",
        status: "success",
      },
      {
        id: 4,
        action: "Report generated",
        type: "Monthly Analytics",
        time: "2 hours ago",
        status: "info",
      },
      {
        id: 5,
        action: "System update",
        version: "v2.1.0",
        time: "6 hours ago",
        status: "success",
      },
      {
        id: 6,
        action: "Security scan",
        result: "Completed",
        time: "1 day ago",
        status: "info",
      },
    ],
    organizationGrowth: [
      { month: "Jan", count: 8 },
      { month: "Feb", count: 10 },
      { month: "Mar", count: 12 },
      { month: "Apr", count: 15 },
      { month: "May", count: 18 },
      { month: "Jun", count: 22 },
    ],
  })

  // Mock data for charts
  const renderGrowthChart = () => {
    const maxCount = Math.max(
      ...stats.organizationGrowth.map((item) => item.count)
    )
    return (
      <div className="flex items-end justify-between h-48 mt-6">
        {stats.organizationGrowth.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-8 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t transition-all duration-500 hover:opacity-80"
              style={{ height: `${(item.count / maxCount) * 100}%` }}
            />
            <span className="text-xs text-slate-500 mt-2 font-medium">
              {item.month}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-emerald-100 text-emerald-700"
      case "pending":
        return "bg-amber-100 text-amber-700"
      case "info":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getStatusDot = (status) => {
    switch (status) {
      case "success":
        return "bg-emerald-500"
      case "pending":
        return "bg-amber-500"
      case "info":
        return "bg-blue-500"
      default:
        return "bg-slate-500"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "info":
        return <FileText className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
        <p className="text-emerald-100">
          Manage organizations and HR managers across the platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total HR Managers
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {stats.totalHRManagers}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-500 font-medium">+12%</span>
            <span className="text-sm text-slate-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Pending Registrations
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {stats.pendingRegistrations}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
            <span className="text-sm text-amber-500 font-medium">
              Action needed
            </span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Active Organizations
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {stats.activeOrganizations}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-500 font-medium">+3 new</span>
            <span className="text-sm text-slate-500 ml-1">this month</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Employees
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {stats.totalEmployees.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-500 font-medium">+8.5%</span>
            <span className="text-sm text-slate-500 ml-1">growth</span>
          </div>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organization Growth Chart */}
        <div className="lg:col-span-2 bg-slate-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Organization Growth
            </h3>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              Last 6 months
            </Badge>
          </div>
          {renderGrowthChart()}
          <div className="mt-4 flex justify-between text-sm text-slate-500">
            <span>Jan 2024</span>
            <span>Jun 2024</span>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              System Status
            </h3>
            <button className="p-2 hover:bg-slate-100 rounded-lg">
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">
                Database
              </span>
              <Badge className="bg-emerald-100 text-emerald-700">
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">
                API Services
              </span>
              <Badge className="bg-emerald-100 text-emerald-700">
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">
                Authentication
              </span>
              <Badge className="bg-emerald-100 text-emerald-700">
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">
                Email Service
              </span>
              <Badge className="bg-amber-100 text-amber-700">Degraded</Badge>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">
                  Overall Health
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-emerald-600">
                    {stats.systemHealth}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-50 rounded-xl shadow-sm">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Activity
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:bg-slate-100"
            >
              View All
            </Button>
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-4">
            {stats.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 p-3 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div
                  className={`w-2 h-2 ${getStatusDot(
                    activity.status
                  )} rounded-full`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-slate-500">
                    {activity.user ||
                      activity.org ||
                      activity.type ||
                      activity.version ||
                      activity.result}{" "}
                    • {activity.time}
                  </p>
                </div>
                <Badge className={getStatusColor(activity.status)}>
                  <span className="flex items-center">
                    {getStatusIcon(activity.status)}
                    <span className="ml-1 capitalize">{activity.status}</span>
                  </span>
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-50 rounded-xl shadow-sm">
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Quick Actions
          </h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-emerald-50 transition-colors border-slate-200"
            >
              <UserPlus className="h-6 w-6 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700">
                Register HR
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 transition-colors border-slate-200"
            >
              <Building className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">
                Manage Orgs
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-amber-50 transition-colors border-slate-200"
            >
              <Users className="h-6 w-6 text-amber-600" />
              <span className="text-sm font-medium text-slate-700">
                Pending Approvals
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 transition-colors border-slate-200"
            >
              <FileText className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium text-slate-700">
                Generate Reports
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
