import React, { useState, useEffect } from "react"
import MainLayout from "../../components/layout/MainLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"
import {
  Search,
  UserPlus,
  Users,
  Filter,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const EmployeeManagementPage = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  useEffect(() => {
    loadEmployees()
  }, [user, token])

  const loadEmployees = async () => {
    if (!user?.organizationId) return

    setLoading(true)
    try {
      const orgId = user.organizationId?._id || user.organizationId
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }api/employees/organization/${orgId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setEmployees(response.data.employees || [])
      } else {
        toast.error(response.data.message || "Failed to load employees")
      }
    } catch (error) {
      console.error("Error loading employees:", error)
      // For demo purposes, use mock data
      setEmployees([
        {
          _id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@company.com",
          employeeId: "EMP001",
          department: "Engineering",
          position: "Software Engineer",
          status: "active",
          joiningDate: "2023-01-15",
        },
        {
          _id: "2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@company.com",
          employeeId: "EMP002",
          department: "Marketing",
          position: "Marketing Manager",
          status: "active",
          joiningDate: "2023-02-20",
        },
        {
          _id: "3",
          firstName: "Mike",
          lastName: "Johnson",
          email: "mike.johnson@company.com",
          employeeId: "EMP003",
          department: "HR",
          position: "HR Specialist",
          status: "on-leave",
          joiningDate: "2022-11-10",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = filterDepartment
      ? employee.department === filterDepartment
      : true
    const matchesStatus = filterStatus ? employee.status === filterStatus : true

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const getUniqueDepartments = () => {
    return [...new Set(employees.map((emp) => emp.department))]
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            Active
          </Badge>
        )
      case "on-leave":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            On Leave
          </Badge>
        )
      case "terminated":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Terminated
          </Badge>
        )
      default:
        return (
          <Badge className="bg-slate-100 text-slate-800 border-slate-200">
            Unknown
          </Badge>
        )
    }
  }

  const handleAddEmployee = () => {
    navigate("/hr/register-employee")
  }

  const handleViewEmployee = (employeeId) => {
    // Navigate to employee profile page (to be implemented)
    toast.info(`Viewing employee ${employeeId}`)
  }

  const handleEditEmployee = (employeeId) => {
    // Navigate to edit employee page (to be implemented)
    toast.info(`Editing employee ${employeeId}`)
  }

  const handleDeleteEmployee = (employeeId) => {
    // Implement delete functionality
    toast.info(`Deleting employee ${employeeId}`)
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Employee Management
            </h1>
            <p className="text-slate-600">
              Manage your organization's employees
            </p>
          </div>
          <Button
            onClick={handleAddEmployee}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Employee
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-900 text-base font-medium">
                Total Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {employees.length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-900 text-base font-medium">
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {employees.filter((emp) => emp.status === "active").length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-900 text-base font-medium">
                On Leave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {employees.filter((emp) => emp.status === "on-leave").length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-900 text-base font-medium">
                Departments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {getUniqueDepartments().length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-900">
              <Filter className="h-5 w-5 text-emerald-600 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Department
                </label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">All Departments</option>
                  {getUniqueDepartments().map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-900">
              <Users className="h-5 w-5 text-emerald-600 mr-2" />
              Employee List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No employees found
                </h3>
                <p className="text-slate-600 mb-4">
                  Get started by adding your first employee.
                </p>
                <Button
                  onClick={handleAddEmployee}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joining Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow
                        key={employee._id}
                        className="hover:bg-slate-100"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-slate-500">
                              {employee.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          {employee.employeeId}
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{getStatusBadge(employee.status)}</TableCell>
                        <TableCell>
                          {new Date(employee.joiningDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewEmployee(employee._id)}
                              className="border-slate-300 hover:bg-slate-100"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditEmployee(employee._id)}
                              className="border-slate-300 hover:bg-slate-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteEmployee(employee._id)}
                              className="border-red-300 hover:bg-red-50 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

export default EmployeeManagementPage
