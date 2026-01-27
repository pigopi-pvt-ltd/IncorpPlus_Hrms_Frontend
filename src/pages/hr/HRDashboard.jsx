import React, { useState, useEffect } from "react"
import MainLayout from "../../components/layout/MainLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  UserPlus,
  FileText,
  BarChart3,
  Briefcase,
} from "lucide-react"

const HRDashboard = () => {
  const { user, token } = useAuth()
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    payrollStatus: "Up to date",
    newHires: 0,
    pendingDocuments: 0,
    upcomingBirthdays: 0,
    attendanceRate: 0,
    avgSalary: 0,
  })

  const [recentActivities, setRecentActivities] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [user, token])

  const loadDashboardData = async () => {
    if (!user?.organizationId) return

    setLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock data for demonstration
      setDashboardStats({
        totalEmployees: 42,
        pendingLeaves: 3,
        payrollStatus: "Processing",
        newHires: 2,
        pendingDocuments: 5,
        upcomingBirthdays: 4,
        attendanceRate: 94.2,
        avgSalary: 45000,
      })

      setRecentActivities([
        {
          id: 1,
          action: "New leave request",
          description: "John Doe requested sick leave",
          time: "2 hours ago",
          status: "pending",
        },
        {
          id: 2,
          action: "Employee onboarded",
          description: "Sarah Johnson joined as Software Engineer",
          time: "1 day ago",
          status: "completed",
        },
        {
          id: 3,
          action: "Document uploaded",
          description: "Mike Chen uploaded PAN card",
          time: "3 days ago",
          status: "completed",
        },
      ])

      setUpcomingEvents([
        {
          id: 1,
          title: "Team Meeting",
          date: "Today, 3:00 PM",
          type: "meeting",
        },
        {
          id: 2,
          title: "Performance Reviews",
          date: "Tomorrow",
          type: "review",
        },
        {
          id: 3,
          title: "Payroll Processing",
          date: "Dec 25, 2023",
          type: "payroll",
        },
      ])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, description, icon: Icon, trend }) => (
    <Card className="bg-slate-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900 text-base font-medium">
            {title}
          </CardTitle>
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Icon className="h-5 w-5 text-emerald-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
          {trend && (
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Welcome Section - Match Dashboard Style */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-emerald-100">
            Here's what's happening with your team today
          </p>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Employees"
            value={dashboardStats.totalEmployees}
            description="Active employees"
            icon={Users}
            trend="+2.5%"
          />
          <StatCard
            title="Pending Leaves"
            value={dashboardStats.pendingLeaves}
            description="Leave requests"
            icon={Calendar}
          />
          <StatCard
            title="Payroll Status"
            value={dashboardStats.payrollStatus}
            description="This month"
            icon={DollarSign}
          />
          <StatCard
            title="New Hires"
            value={dashboardStats.newHires}
            description="This month"
            icon={UserPlus}
            trend="+1"
          />
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-slate-900">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                Pending Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {dashboardStats.pendingDocuments}
              </p>
              <p className="text-sm text-slate-600">Awaiting verification</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full border-slate-300 hover:bg-slate-100"
              >
                Review Documents
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-slate-900">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                Upcoming Birthdays
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {dashboardStats.upcomingBirthdays}
              </p>
              <p className="text-sm text-slate-600">This month</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full border-slate-300 hover:bg-slate-100"
              >
                View All
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-slate-900">
                <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
                Attendance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {dashboardStats.attendanceRate}%
              </p>
              <p className="text-sm text-slate-600">This week</p>
              <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${dashboardStats.attendanceRate}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activities and Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900">
                <FileText className="h-5 w-5 text-emerald-600 mr-2" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        activity.status === "completed"
                          ? "bg-emerald-100"
                          : "bg-amber-100"
                      }`}
                    >
                      {activity.status === "completed" ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">
                        {activity.action}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                    <Badge
                      variant={
                        activity.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                      className="capitalize bg-emerald-100 text-emerald-800 border-emerald-200"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-slate-300 hover:bg-slate-100"
              >
                View All Activities
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center space-x-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">
                        {event.title}
                      </h4>
                      <p className="text-sm text-slate-600">{event.date}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="capitalize border-slate-300"
                    >
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-slate-300 hover:bg-slate-100"
              >
                View Calendar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-emerald-600 hover:bg-emerald-700">
                <UserPlus className="h-6 w-6" />
                <span>Add Employee</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-slate-300 hover:bg-slate-100"
              >
                <DollarSign className="h-6 w-6" />
                <span>Process Payroll</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-slate-300 hover:bg-slate-100"
              >
                <Calendar className="h-6 w-6" />
                <span>Review Leaves</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-slate-300 hover:bg-slate-100"
              >
                <BarChart3 className="h-6 w-6" />
                <span>Generate Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

export default HRDashboard
