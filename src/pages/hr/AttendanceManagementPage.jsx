import React, { useState, useEffect } from "react"
import MainLayout from "../../components/layout/MainLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Download,
  Filter,
} from "lucide-react"

const AttendanceManagementPage = () => {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [attendances, setAttendances] = useState([])
  const [employees, setEmployees] = useState([])
  const [filters, setFilters] = useState({
    userId: "",
    startDate: "",
    endDate: "",
    status: "",
  })

  useEffect(() => {
    loadAttendanceData()
    loadEmployees()
  }, [user, token, filters])

  const loadAttendanceData = async () => {
    if (!user?.organizationId) return

    setLoading(true)
    try {
      const orgId = user.organizationId?._id || user.organizationId
      const params = new URLSearchParams()

      if (filters.startDate) params.append("startDate", filters.startDate)
      if (filters.endDate) params.append("endDate", filters.endDate)

      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }api/attendance/summary/organizations/${orgId}?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setAttendances(response.data.summary || [])
      } else {
        toast.error(response.data.message || "Failed to load attendance data")
      }
    } catch (error) {
      console.error("Error loading attendance data:", error)
      // Handle different error response formats
      let errorMessage = "Failed to load attendance data"
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error
        } else if (Array.isArray(error.response.data?.errors)) {
          errorMessage = error.response.data.errors
            .map((err) => err.msg || err.message || err)
            .join(", ")
        } else {
          errorMessage = `Server Error: ${error.response.status} - ${error.response.statusText}`
        }
      } else if (error.request) {
        errorMessage =
          "Network error: Unable to connect to server. Please check your connection."
      } else {
        errorMessage = error.message || "An unexpected error occurred"
      }
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const loadEmployees = async () => {
    if (!user?.organizationId) return

    try {
      const orgId = user.organizationId?._id || user.organizationId
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }api/auth/organization/${orgId}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setEmployees(response.data.users || [])
      } else {
        toast.error(response.data.message || "Failed to load employees")
      }
    } catch (error) {
      console.error("Error loading employees:", error)
      // Handle different error response formats
      let errorMessage = "Failed to load employees"
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error
        } else if (Array.isArray(error.response.data?.errors)) {
          errorMessage = error.response.data.errors
            .map((err) => err.msg || err.message || err)
            .join(", ")
        } else {
          errorMessage = `Server Error: ${error.response.status} - ${error.response.statusText}`
        }
      } else if (error.request) {
        errorMessage =
          "Network error: Unable to connect to server. Please check your connection."
      } else {
        errorMessage = error.message || "An unexpected error occurred"
      }
      toast.error(errorMessage)
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const exportAttendanceReport = () => {
    // Export functionality would go here
    toast.success("Attendance report exported successfully")
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Present":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Late":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Absent":
        return "bg-red-100 text-red-800 border-red-200"
      case "Leave":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Clock className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Clock className="h-8 w-8 text-emerald-600" />
            Attendance Management
          </h1>
          <p className="text-slate-600 mt-2">
            Monitor and manage employee attendance records
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Filter className="h-5 w-5 text-emerald-600" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select
                  value={filters.userId}
                  onValueChange={(value) => handleFilterChange("userId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Late">Late</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                    <SelectItem value="Leave">Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                onClick={loadAttendanceData}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>

              <Button variant="outline" onClick={exportAttendanceReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary */}
        <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-slate-900">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Attendance Summary
              </div>
              <Badge variant="outline" className="bg-white">
                {attendances.length} records
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">
                      Employee
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">
                      Total Days
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">
                      Present
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">
                      Late
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">
                      Absent
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">
                      Leave
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">
                      Attendance %
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">
                      Overtime (hrs)
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">
                      Avg Late (min)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.length > 0 ? (
                    attendances.map((record, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium">
                            {record.userName ||
                              `${record.firstName} ${record.lastName}`}
                          </div>
                        </td>
                        <td className="py-3 px-4">{record.totalDays}</td>
                        <td className="py-3 px-4">{record.presentDays}</td>
                        <td className="py-3 px-4">{record.lateDays}</td>
                        <td className="py-3 px-4">{record.absentDays}</td>
                        <td className="py-3 px-4">{record.leaveDays}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={`${getStatusBadgeVariant(
                              record.attendancePercentage >= 90
                                ? "Present"
                                : "Late"
                            )} text-sm`}
                          >
                            {record.attendancePercentage.toFixed(2)}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {record.totalOvertime || 0}
                        </td>
                        <td className="py-3 px-4">
                          {record.averageLateMinutes || 0} min
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="py-8 px-4 text-center text-slate-500"
                      >
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Daily Attendance View */}
        <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Calendar className="h-5 w-5 text-emerald-600" />
              Daily Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm">
              Detailed daily attendance records will be displayed here. This
              view shows individual time-in and time-out records for each
              employee.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

export default AttendanceManagementPage
