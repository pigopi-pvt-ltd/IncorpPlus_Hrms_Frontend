import React, { useState, useEffect } from "react"
import MainLayout from "../../components/layout/MainLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"
import {
  Building,
  User,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const MasterDataManagementPage = () => {
  const { user, token } = useAuth()
  const [activeTab, setActiveTab] = useState("departments")
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [loading, setLoading] = useState(false)

  // Form states
  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    code: "",
    description: "",
  })

  const [designationForm, setDesignationForm] = useState({
    name: "",
    code: "",
    description: "",
    departmentId: "",
    level: "",
  })

  const [editingDepartment, setEditingDepartment] = useState(null)
  const [editingDesignation, setEditingDesignation] = useState(null)
  const [expandedDepartments, setExpandedDepartments] = useState(new Set())

  useEffect(() => {
    loadData()
  }, [activeTab, user, token])

  const loadData = async () => {
    if (!user?.organizationId) return

    setLoading(true)
    try {
      const orgId = user.organizationId?._id || user.organizationId

      if (activeTab === "departments") {
        await loadDepartments(orgId)
      } else {
        await loadDesignations(orgId)
        await loadDepartments(orgId) // Need departments for designation form
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const loadDepartments = async (orgId) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }api/masterdata/organizations/${orgId}/departments?includeInactive=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setDepartments(response.data.departments || [])
      }
    } catch (error) {
      console.error("Error loading departments:", error)
    }
  }

  const loadDesignations = async (orgId) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }api/masterdata/organizations/${orgId}/designations?includeInactive=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setDesignations(response.data.designations || [])
      }
    } catch (error) {
      console.error("Error loading designations:", error)
    }
  }

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault()

    if (!departmentForm.name || !departmentForm.code) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const orgId = user.organizationId?._id || user.organizationId
      const url = editingDepartment
        ? `${import.meta.env.VITE_API_BASE_URL}api/masterdata/departments/${
            editingDepartment._id
          }`
        : `${import.meta.env.VITE_API_BASE_URL}api/masterdata/departments`

      const method = editingDepartment ? "put" : "post"
      const data = {
        ...departmentForm,
        organizationId: orgId,
      }

      const response = await axios[method](url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        toast.success(
          editingDepartment
            ? "Department updated successfully"
            : "Department created successfully"
        )
        resetDepartmentForm()
        loadData()
      } else {
        toast.error(response.data.message || "Operation failed")
      }
    } catch (error) {
      console.error("Error saving department:", error)
      toast.error("Failed to save department")
    }
  }

  const handleDesignationSubmit = async (e) => {
    e.preventDefault()

    if (
      !designationForm.name ||
      !designationForm.code ||
      !designationForm.departmentId
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const url = editingDesignation
        ? `${import.meta.env.VITE_API_BASE_URL}api/masterdata/designations/${
            editingDesignation._id
          }`
        : `${import.meta.env.VITE_API_BASE_URL}api/masterdata/designations`

      const method = editingDesignation ? "put" : "post"
      const data = {
        name: designationForm.name,
        code: designationForm.code,
        description: designationForm.description,
        departmentId:
          typeof designationForm.departmentId === "object"
            ? designationForm.departmentId._id ||
              designationForm.departmentId.id
            : designationForm.departmentId, // Ensure we're passing the department's _id as a string
        level: parseInt(designationForm.level) || 0,
      }

      const response = await axios[method](url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        toast.success(
          editingDesignation
            ? "Designation updated successfully"
            : "Designation created successfully"
        )
        resetDesignationForm()
        loadData()
      } else {
        toast.error(response.data.message || "Operation failed")
      }
    } catch (error) {
      console.error("Error saving designation:", error)
      toast.error("Failed to save designation")
    }
  }

  const handleEditDepartment = (department) => {
    setEditingDepartment(department)
    setDepartmentForm({
      name: department.name,
      code: department.code,
      description: department.description || "",
    })
  }

  const handleEditDesignation = (designation) => {
    setEditingDesignation(designation)
    setDesignationForm({
      name: designation.name,
      code: designation.code,
      description: designation.description || "",
      departmentId: designation.departmentId?._id || designation.departmentId,
      level: designation.level?.toString() || "",
    })
  }

  const handleDeleteDepartment = async (departmentId) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return

    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_BASE_URL
        }api/masterdata/departments/${departmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        toast.success("Department deleted successfully")
        loadData()
      } else {
        toast.error(response.data.message || "Failed to delete department")
      }
    } catch (error) {
      console.error("Error deleting department:", error)
      toast.error("Failed to delete department")
    }
  }

  const handleDeleteDesignation = async (designationId) => {
    if (!window.confirm("Are you sure you want to delete this designation?"))
      return

    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_BASE_URL
        }api/masterdata/designations/${designationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        toast.success("Designation deleted successfully")
        loadData()
      } else {
        toast.error(response.data.message || "Failed to delete designation")
      }
    } catch (error) {
      console.error("Error deleting designation:", error)
      toast.error("Failed to delete designation")
    }
  }

  const resetDepartmentForm = () => {
    setDepartmentForm({ name: "", code: "", description: "" })
    setEditingDepartment(null)
  }

  const resetDesignationForm = () => {
    setDesignationForm({
      name: "",
      code: "",
      description: "",
      departmentId: "",
      level: "",
    })
    setEditingDesignation(null)
  }

  const toggleDepartmentExpansion = (deptId) => {
    const newExpanded = new Set(expandedDepartments)
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId)
    } else {
      newExpanded.add(deptId)
    }
    setExpandedDepartments(newExpanded)
  }

  const getDesignationsByDepartment = (deptId) => {
    return designations.filter(
      (designation) =>
        designation.departmentId?._id === deptId ||
        designation.departmentId === deptId
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Master Data Management
          </h1>
          <p className="text-slate-600">
            Manage departments and designations for your organization
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("departments")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "departments"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <Building className="h-4 w-4 inline mr-2" />
              Departments
            </button>
            <button
              onClick={() => setActiveTab("designations")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "designations"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              Designations
            </button>
          </nav>
        </div>

        {activeTab === "departments" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Form */}
            <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900">
                  <Building className="h-5 w-5 text-emerald-600 mr-2" />
                  {editingDepartment ? "Edit Department" : "Add New Department"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDepartmentSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deptName">Department Name *</Label>
                    <Input
                      id="deptName"
                      value={departmentForm.name}
                      onChange={(e) =>
                        setDepartmentForm({
                          ...departmentForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter department name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deptCode">Department Code *</Label>
                    <Input
                      id="deptCode"
                      value={departmentForm.code}
                      onChange={(e) =>
                        setDepartmentForm({
                          ...departmentForm,
                          code: e.target.value,
                        })
                      }
                      placeholder="Enter department code"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deptDescription">Description</Label>
                    <Textarea
                      id="deptDescription"
                      value={departmentForm.description}
                      onChange={(e) =>
                        setDepartmentForm({
                          ...departmentForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter department description"
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {editingDepartment
                        ? "Update Department"
                        : "Create Department"}
                    </Button>
                    {editingDepartment && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetDepartmentForm}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Departments List */}
            <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-slate-900">
                  <span>Departments ({departments.length})</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Quick Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-50">
                      <DialogHeader>
                        <DialogTitle>Add New Department</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleDepartmentSubmit}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="quickDeptName">
                            Department Name *
                          </Label>
                          <Input
                            id="quickDeptName"
                            value={departmentForm.name}
                            onChange={(e) =>
                              setDepartmentForm({
                                ...departmentForm,
                                name: e.target.value,
                              })
                            }
                            placeholder="Enter department name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quickDeptCode">
                            Department Code *
                          </Label>
                          <Input
                            id="quickDeptCode"
                            value={departmentForm.code}
                            onChange={(e) =>
                              setDepartmentForm({
                                ...departmentForm,
                                code: e.target.value,
                              })
                            }
                            placeholder="Enter department code"
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                          Create Department
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  </div>
                ) : departments.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Building className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No departments found</p>
                    <p className="text-sm">
                      Create your first department to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {departments.map((department) => (
                      <div
                        key={department._id}
                        className="border border-slate-200 rounded-lg bg-white"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-slate-900">
                                {department.name}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {department.code}
                              </p>
                              {department.description && (
                                <p className="text-sm text-slate-500 mt-1">
                                  {department.description}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditDepartment(department)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleDeleteDepartment(department._id)
                                }
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Designation Form */}
            <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900">
                  <User className="h-5 w-5 text-emerald-600 mr-2" />
                  {editingDesignation
                    ? "Edit Designation"
                    : "Add New Designation"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDesignationSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="desigName">Designation Name *</Label>
                    <Input
                      id="desigName"
                      value={designationForm.name}
                      onChange={(e) =>
                        setDesignationForm({
                          ...designationForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter designation name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desigCode">Designation Code *</Label>
                    <Input
                      id="desigCode"
                      value={designationForm.code}
                      onChange={(e) =>
                        setDesignationForm({
                          ...designationForm,
                          code: e.target.value,
                        })
                      }
                      placeholder="Enter designation code"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desigDepartment">Department *</Label>
                    <select
                      id="desigDepartment"
                      value={designationForm.departmentId}
                      onChange={(e) =>
                        setDesignationForm({
                          ...designationForm,
                          departmentId: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desigLevel">Level</Label>
                    <Input
                      id="desigLevel"
                      type="number"
                      value={designationForm.level}
                      onChange={(e) =>
                        setDesignationForm({
                          ...designationForm,
                          level: e.target.value,
                        })
                      }
                      placeholder="Enter level (numeric)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desigDescription">Description</Label>
                    <Textarea
                      id="desigDescription"
                      value={designationForm.description}
                      onChange={(e) =>
                        setDesignationForm({
                          ...designationForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter designation description"
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {editingDesignation
                        ? "Update Designation"
                        : "Create Designation"}
                    </Button>
                    {editingDesignation && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetDesignationForm}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Designations List with Department Grouping */}
            <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-slate-900">
                  <span>Designations ({designations.length})</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Quick Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-50">
                      <DialogHeader>
                        <DialogTitle>Add New Designation</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleDesignationSubmit}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="quickDesigName">
                            Designation Name *
                          </Label>
                          <Input
                            id="quickDesigName"
                            value={designationForm.name}
                            onChange={(e) =>
                              setDesignationForm({
                                ...designationForm,
                                name: e.target.value,
                              })
                            }
                            placeholder="Enter designation name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quickDesigDepartment">
                            Department *
                          </Label>
                          <select
                            id="quickDesigDepartment"
                            value={designationForm.departmentId}
                            onChange={(e) =>
                              setDesignationForm({
                                ...designationForm,
                                departmentId: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                              <option key={dept._id} value={dept._id}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                          Create Designation
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  </div>
                ) : departments.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <User className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>Please create departments first</p>
                    <p className="text-sm">
                      Designations require a department to be created
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {departments.map((department) => {
                      const deptDesignations = getDesignationsByDepartment(
                        department._id
                      )
                      const isExpanded = expandedDepartments.has(department._id)

                      return (
                        <div
                          key={department._id}
                          className="border border-slate-200 rounded-lg bg-white"
                        >
                          <div
                            className="p-4 cursor-pointer flex items-center justify-between hover:bg-slate-50"
                            onClick={() =>
                              toggleDepartmentExpansion(department._id)
                            }
                          >
                            <div>
                              <h3 className="font-medium text-slate-900">
                                {department.name}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {deptDesignations.length} designations
                              </p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-slate-400" />
                            )}
                          </div>

                          {isExpanded && (
                            <div className="border-t border-slate-200 p-4 space-y-3">
                              {deptDesignations.length === 0 ? (
                                <p className="text-slate-500 text-sm">
                                  No designations in this department
                                </p>
                              ) : (
                                deptDesignations.map((designation) => (
                                  <div
                                    key={designation._id}
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded"
                                  >
                                    <div>
                                      <h4 className="font-medium text-slate-900">
                                        {designation.name}
                                      </h4>
                                      <p className="text-sm text-slate-600">
                                        {designation.code}
                                      </p>
                                      {designation.level && (
                                        <p className="text-xs text-slate-500">
                                          Level: {designation.level}
                                        </p>
                                      )}
                                      {designation.description && (
                                        <p className="text-sm text-slate-500 mt-1">
                                          {designation.description}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleEditDesignation(designation)
                                        }
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleDeleteDesignation(
                                            designation._id
                                          )
                                        }
                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default MasterDataManagementPage
