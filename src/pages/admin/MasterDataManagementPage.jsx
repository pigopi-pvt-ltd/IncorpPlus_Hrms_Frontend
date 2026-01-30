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
  Calendar,
  Clock,
  Users,
  Settings,
  RefreshCw,
  X,
} from "lucide-react"

const MasterDataManagementPage = () => {
  const { user, token } = useAuth()
  const [activeTab, setActiveTab] = useState("departments")
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

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

  // States for leave types and holidays
  const [leaveTypes, setLeaveTypes] = useState([])
  const [holidays, setHolidays] = useState([])

  // Leave Type Form State
  const [leaveTypeForm, setLeaveTypeForm] = useState({
    name: "",
    code: "",
    description: "",
    defaultDays: 20,
    isPaid: true, // Add isPaid field
    isCarryForward: false,
    maxCarryForwardDays: 0,
    requiresApproval: true,
    maxConsecutiveDays: 15,
    minNoticeDays: 3,
    applicableTo: {
      employmentTypes: ["Full_Time"],
      departments: [],
      designations: [],
      minimumLevel: 0,
      minimumServicePeriodMonths: 0,
    },
    excludedDepartments: [],
    excludedDesignations: [],
    probationPeriodMonths: 3,
  })

  // Holiday Form State
  const [holidayForm, setHolidayForm] = useState({
    name: "",
    date: "",
    type: "National",
    description: "",
    isPaid: true, // New field - defaults to paid holiday
    applicableTo: {
      departments: [],
      designations: [],
    },
    isRecurring: false,
    recurrencePattern: "Yearly",
    recurringRule: {
      frequency: "yearly",
      interval: 1,
    },
  })

  const [editingDepartment, setEditingDepartment] = useState(null)
  const [editingDesignation, setEditingDesignation] = useState(null)
  const [editingLeaveType, setEditingLeaveType] = useState(null) // Add editing state
  const [editingHoliday, setEditingHoliday] = useState(null) // Add editing state
  const [expandedDepartments, setExpandedDepartments] = useState(new Set())

  useEffect(() => {
    loadData()
  }, [activeTab, user, token])

  const loadData = async () => {
    if (!user?.organizationId) return

    setLoading(true)
    try {
      const orgId = user.organizationId?._id || user.organizationId

      switch (activeTab) {
        case "departments":
          await loadDepartments(orgId)
          break
        case "designations":
          await loadDesignations(orgId)
          await loadDepartments(orgId) // Need departments for designation form
          break
        case "leave-types":
          await loadLeaveTypes(orgId)
          break
        case "holidays":
          await loadHolidays(orgId)
          break
        default:
          await loadDepartments(orgId)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  // Existing load functions remain the same...
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

  // Add new load functions for leave types and holidays
  const loadLeaveTypes = async (orgId) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }api/leave/organizations/${orgId}/types`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setLeaveTypes(response.data.leaveTypes || [])
      }
    } catch (error) {
      console.error("Error loading leave types:", error)
      // Handle different error response formats
      let errorMessage = "Failed to load leave types"
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

  const loadHolidays = async (orgId) => {
    try {
      const currentYear = new Date().getFullYear()
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }api/holidays/organizations/${orgId}?year=${currentYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setHolidays(response.data.holidays || [])
      }
    } catch (error) {
      console.error("Error loading holidays:", error)
      // Handle different error response formats
      let errorMessage = "Failed to load holidays"
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

  // Add new handler functions for leave types
  const handleLeaveTypeSubmit = async (e) => {
    e.preventDefault()

    if (!leaveTypeForm.name || !leaveTypeForm.code) {
      toast.error("Please fill in all required fields")
      return
    }

    setSaving(true)
    try {
      const orgId = user.organizationId?._id || user.organizationId
      const url = editingLeaveType
        ? `${import.meta.env.VITE_API_BASE_URL}api/leave/types/${
            editingLeaveType._id
          }`
        : `${import.meta.env.VITE_API_BASE_URL}api/leave/types`

      const method = editingLeaveType ? "put" : "post"
      const data = {
        ...leaveTypeForm,
        organizationId: orgId,
        // Ensure applicableTo is in the correct format
        applicableTo: {
          ...leaveTypeForm.applicableTo,
          employmentTypes: Array.isArray(
            leaveTypeForm.applicableTo.employmentTypes
          )
            ? leaveTypeForm.applicableTo.employmentTypes
            : ["Full_Time"],
        },
      }

      const response = await axios[method](url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        toast.success(
          editingLeaveType
            ? "Leave type updated successfully"
            : "Leave type created successfully"
        )
        resetLeaveTypeForm()
        loadData()
      } else {
        // Handle different error response formats
        let errorMessage = "Operation failed"
        if (response.data.message) {
          errorMessage = response.data.message
        } else if (response.data.error) {
          errorMessage = response.data.error
        } else if (Array.isArray(response.data.errors)) {
          errorMessage = response.data.errors
            .map((err) => err.msg || err.message || err)
            .join(", ")
        } else if (typeof response.data === "object") {
          const errorKeys = Object.keys(response.data).filter(
            (key) =>
              key.toLowerCase().includes("error") ||
              key.toLowerCase().includes("message")
          )
          if (errorKeys.length > 0) {
            errorMessage = response.data[errorKeys[0]]
          }
        }
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Error saving leave type:", error)
      // Handle different types of errors
      let errorMessage = "Failed to save leave type"
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
      setSaving(false)
    }
  }

  const handleEditLeaveType = (leaveType) => {
    setEditingLeaveType(leaveType)
    setLeaveTypeForm({
      name: leaveType.name,
      code: leaveType.code,
      description: leaveType.description || "",
      defaultDays: leaveType.defaultDays || 20,
      isPaid: leaveType.isPaid !== undefined ? leaveType.isPaid : true, // Handle isPaid field
      isCarryForward: leaveType.isCarryForward || false,
      maxCarryForwardDays: leaveType.maxCarryForwardDays || 0,
      requiresApproval:
        leaveType.requiresApproval !== undefined
          ? leaveType.requiresApproval
          : true,
      maxConsecutiveDays: leaveType.maxConsecutiveDays || 15,
      minNoticeDays: leaveType.minNoticeDays || 3,
      applicableTo: leaveType.applicableTo || {
        employmentTypes: ["Full_Time"],
        departments: [],
        designations: [],
        minimumLevel: 0,
        minimumServicePeriodMonths: 0,
      },
      excludedDepartments: leaveType.excludedDepartments || [],
      excludedDesignations: leaveType.excludedDesignations || [],
      probationPeriodMonths: leaveType.probationPeriodMonths || 3,
    })
  }

  const handleDeleteLeaveType = async (leaveTypeId) => {
    if (!window.confirm("Are you sure you want to delete this leave type?"))
      return

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}api/leave/types/${leaveTypeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        toast.success("Leave type deleted successfully")
        loadData()
      } else {
        // Handle different error response formats
        let errorMessage = "Failed to delete leave type"
        if (response.data.message) {
          errorMessage = response.data.message
        } else if (response.data.error) {
          errorMessage = response.data.error
        } else if (Array.isArray(response.data.errors)) {
          errorMessage = response.data.errors
            .map((err) => err.msg || err.message || err)
            .join(", ")
        } else if (typeof response.data === "object") {
          const errorKeys = Object.keys(response.data).filter(
            (key) =>
              key.toLowerCase().includes("error") ||
              key.toLowerCase().includes("message")
          )
          if (errorKeys.length > 0) {
            errorMessage = response.data[errorKeys[0]]
          }
        }
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Error deleting leave type:", error)
      // Handle different types of errors
      let errorMessage = "Failed to delete leave type"
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

  const resetLeaveTypeForm = () => {
    setLeaveTypeForm({
      name: "",
      code: "",
      description: "",
      defaultDays: 20,
      isPaid: true, // Reset isPaid field
      isCarryForward: false,
      maxCarryForwardDays: 0,
      requiresApproval: true,
      maxConsecutiveDays: 15,
      minNoticeDays: 3,
      applicableTo: {
        employmentTypes: ["Full_Time"],
        departments: [],
        designations: [],
        minimumLevel: 0,
        minimumServicePeriodMonths: 0,
      },
      excludedDepartments: [],
      excludedDesignations: [],
      probationPeriodMonths: 3,
    })
    setEditingLeaveType(null)
  }

  // Add new handler functions for holidays
  const handleHolidaySubmit = async (e) => {
    e.preventDefault()

    if (!holidayForm.name || !holidayForm.date) {
      toast.error("Please fill in all required fields")
      return
    }

    setSaving(true)
    try {
      const orgId = user.organizationId?._id || user.organizationId
      const url = editingHoliday
        ? `${import.meta.env.VITE_API_BASE_URL}api/holidays/${
            editingHoliday._id
          }`
        : `${import.meta.env.VITE_API_BASE_URL}api/holidays`

      const method = editingHoliday ? "put" : "post"
      const data = {
        ...holidayForm,
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
          editingHoliday
            ? "Holiday updated successfully"
            : "Holiday created successfully"
        )
        resetHolidayForm()
        loadData()
      } else {
        // Handle different error response formats
        let errorMessage = "Operation failed"
        if (response.data.message) {
          errorMessage = response.data.message
        } else if (response.data.error) {
          errorMessage = response.data.error
        } else if (Array.isArray(response.data.errors)) {
          errorMessage = response.data.errors
            .map((err) => err.msg || err.message || err)
            .join(", ")
        } else if (typeof response.data === "object") {
          const errorKeys = Object.keys(response.data).filter(
            (key) =>
              key.toLowerCase().includes("error") ||
              key.toLowerCase().includes("message")
          )
          if (errorKeys.length > 0) {
            errorMessage = response.data[errorKeys[0]]
          }
        }
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Error saving holiday:", error)
      // Handle different types of errors
      let errorMessage = "Failed to save holiday"
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
      setSaving(false)
    }
  }

  const handleEditHoliday = (holiday) => {
    setEditingHoliday(holiday)
    setHolidayForm({
      name: holiday.name,
      date: holiday.date ? holiday.date.split("T")[0] : "",
      type: holiday.type || "National",
      description: holiday.description || "",
      isPaid: holiday.isPaid !== undefined ? holiday.isPaid : true,
      applicableTo: holiday.applicableTo || {
        departments: [],
        designations: [],
      },
      isRecurring: holiday.isRecurring || false,
      recurrencePattern: holiday.recurrencePattern || "Yearly",
      recurringRule: holiday.recurringRule || {
        frequency: "yearly",
        interval: 1,
      },
    })
  }

  const handleDeleteHoliday = async (holidayId) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) return

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}api/holidays/${holidayId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        toast.success("Holiday deleted successfully")
        loadData()
      } else {
        // Handle different error response formats
        let errorMessage = "Failed to delete holiday"
        if (response.data.message) {
          errorMessage = response.data.message
        } else if (response.data.error) {
          errorMessage = response.data.error
        } else if (Array.isArray(response.data.errors)) {
          errorMessage = response.data.errors
            .map((err) => err.msg || err.message || err)
            .join(", ")
        } else if (typeof response.data === "object") {
          const errorKeys = Object.keys(response.data).filter(
            (key) =>
              key.toLowerCase().includes("error") ||
              key.toLowerCase().includes("message")
          )
          if (errorKeys.length > 0) {
            errorMessage = response.data[errorKeys[0]]
          }
        }
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Error deleting holiday:", error)
      // Handle different types of errors
      let errorMessage = "Failed to delete holiday"
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

  const resetHolidayForm = () => {
    setHolidayForm({
      name: "",
      date: "",
      type: "National",
      description: "",
      isPaid: true,
      applicableTo: {
        departments: [],
        designations: [],
      },
      isRecurring: false,
      recurrencePattern: "Yearly",
      recurringRule: {
        frequency: "yearly",
        interval: 1,
      },
    })
    setEditingHoliday(null)
  }

  // Designation handler functions
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
            : designationForm.departmentId,
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
        // Handle different error response formats
        let errorMessage = "Operation failed"
        if (response.data.message) {
          errorMessage = response.data.message
        } else if (response.data.error) {
          errorMessage = response.data.error
        } else if (Array.isArray(response.data.errors)) {
          errorMessage = response.data.errors
            .map((err) => err.msg || err.message || err)
            .join(", ")
        } else if (typeof response.data === "object") {
          const errorKeys = Object.keys(response.data).filter(
            (key) =>
              key.toLowerCase().includes("error") ||
              key.toLowerCase().includes("message")
          )
          if (errorKeys.length > 0) {
            errorMessage = response.data[errorKeys[0]]
          }
        }
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Error saving designation:", error)
      // Handle different types of errors
      let errorMessage = "Failed to save designation"
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
        // Handle different error response formats
        let errorMessage = "Failed to delete designation"
        if (response.data.message) {
          errorMessage = response.data.message
        } else if (response.data.error) {
          errorMessage = response.data.error
        } else if (Array.isArray(response.data.errors)) {
          errorMessage = response.data.errors
            .map((err) => err.msg || err.message || err)
            .join(", ")
        } else if (typeof response.data === "object") {
          const errorKeys = Object.keys(response.data).filter(
            (key) =>
              key.toLowerCase().includes("error") ||
              key.toLowerCase().includes("message")
          )
          if (errorKeys.length > 0) {
            errorMessage = response.data[errorKeys[0]]
          }
        }
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Error deleting designation:", error)
      // Handle different types of errors
      let errorMessage = "Failed to delete designation"
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

  // Existing handler functions remain the same...
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
        // Handle different error response formats
        let errorMessage = "Operation failed"
        if (response.data.message) {
          errorMessage = response.data.message
        } else if (response.data.error) {
          errorMessage = response.data.error
        } else if (Array.isArray(response.data.errors)) {
          errorMessage = response.data.errors
            .map((err) => err.msg || err.message || err)
            .join(", ")
        } else if (typeof response.data === "object") {
          const errorKeys = Object.keys(response.data).filter(
            (key) =>
              key.toLowerCase().includes("error") ||
              key.toLowerCase().includes("message")
          )
          if (errorKeys.length > 0) {
            errorMessage = response.data[errorKeys[0]]
          }
        }
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Error saving department:", error)
      // Handle different types of errors
      let errorMessage = "Failed to save department"
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

  // ... rest of existing functions remain unchanged ...

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
            Manage departments, designations, leave types, and holidays for your
            organization
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
            <button
              onClick={() => setActiveTab("leave-types")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "leave-types"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <Clock className="h-4 w-4 inline mr-2" />
              Leave Types
            </button>
            <button
              onClick={() => setActiveTab("holidays")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "holidays"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Holidays
            </button>
          </nav>
        </div>

        {/* Departments Tab */}
        {activeTab === "departments" && (
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
        )}

        {/* Designations Tab */}
        {activeTab === "designations" && (
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

        {/* Leave Types Tab */}
        {activeTab === "leave-types" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leave Type Form */}
            <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900">
                  <Clock className="h-5 w-5 text-emerald-600 mr-2" />
                  {editingLeaveType ? "Edit Leave Type" : "Add New Leave Type"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLeaveTypeSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="leaveTypeName">Leave Type Name *</Label>
                    <Input
                      id="leaveTypeName"
                      value={leaveTypeForm.name}
                      onChange={(e) =>
                        setLeaveTypeForm({
                          ...leaveTypeForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter leave type name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leaveTypeCode">Leave Type Code *</Label>
                    <Input
                      id="leaveTypeCode"
                      value={leaveTypeForm.code}
                      onChange={(e) =>
                        setLeaveTypeForm({
                          ...leaveTypeForm,
                          code: e.target.value,
                        })
                      }
                      placeholder="Enter leave type code"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leaveTypeDescription">Description</Label>
                    <Textarea
                      id="leaveTypeDescription"
                      value={leaveTypeForm.description}
                      onChange={(e) =>
                        setLeaveTypeForm({
                          ...leaveTypeForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter leave type description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultDays">Default Days</Label>
                      <Input
                        id="defaultDays"
                        type="number"
                        value={leaveTypeForm.defaultDays}
                        onChange={(e) =>
                          setLeaveTypeForm({
                            ...leaveTypeForm,
                            defaultDays: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="Enter default days"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxConsecutiveDays">
                        Max Consecutive Days
                      </Label>
                      <Input
                        id="maxConsecutiveDays"
                        type="number"
                        value={leaveTypeForm.maxConsecutiveDays}
                        onChange={(e) =>
                          setLeaveTypeForm({
                            ...leaveTypeForm,
                            maxConsecutiveDays: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="Enter max consecutive days"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minNoticeDays">Min Notice Days</Label>
                      <Input
                        id="minNoticeDays"
                        type="number"
                        value={leaveTypeForm.minNoticeDays}
                        onChange={(e) =>
                          setLeaveTypeForm({
                            ...leaveTypeForm,
                            minNoticeDays: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="Enter minimum notice days"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="probationPeriodMonths">
                        Probation Period (months)
                      </Label>
                      <Input
                        id="probationPeriodMonths"
                        type="number"
                        value={leaveTypeForm.probationPeriodMonths}
                        onChange={(e) =>
                          setLeaveTypeForm({
                            ...leaveTypeForm,
                            probationPeriodMonths:
                              parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="Enter probation period months"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPaid"
                        checked={leaveTypeForm.isPaid}
                        onChange={(e) =>
                          setLeaveTypeForm({
                            ...leaveTypeForm,
                            isPaid: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <Label htmlFor="isPaid">Paid Leave</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isCarryForward"
                        checked={leaveTypeForm.isCarryForward}
                        onChange={(e) =>
                          setLeaveTypeForm({
                            ...leaveTypeForm,
                            isCarryForward: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <Label htmlFor="isCarryForward">
                        Carry Forward Allowed
                      </Label>
                    </div>

                    {leaveTypeForm.isCarryForward && (
                      <div className="space-y-2 ml-6">
                        <Label htmlFor="maxCarryForwardDays">
                          Max Carry Forward Days
                        </Label>
                        <Input
                          id="maxCarryForwardDays"
                          type="number"
                          value={leaveTypeForm.maxCarryForwardDays}
                          onChange={(e) =>
                            setLeaveTypeForm({
                              ...leaveTypeForm,
                              maxCarryForwardDays:
                                parseInt(e.target.value) || 0,
                            })
                          }
                          placeholder="Enter max carry forward days"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requiresApproval"
                        checked={leaveTypeForm.requiresApproval}
                        onChange={(e) =>
                          setLeaveTypeForm({
                            ...leaveTypeForm,
                            requiresApproval: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <Label htmlFor="requiresApproval">
                        Requires Approval
                      </Label>
                    </div>
                  </div>

                  {/* Applicable To Section - Clean Multi-Select */}
                  <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-medium text-slate-900 flex items-center gap-2">
                      <Users className="h-4 w-4 text-emerald-600" />
                      Applicable To
                    </h4>

                    {/* Departments Multi-Select */}
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-700">
                        Departments
                      </Label>
                      <div className="border border-slate-300 rounded-lg bg-white p-3">
                        {/* Selected Departments as Chips */}
                        {(leaveTypeForm.applicableTo.departments || []).length >
                          0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(leaveTypeForm.applicableTo.departments || []).map(
                              (deptId) => {
                                const dept = departments.find(
                                  (d) => d._id === deptId
                                )
                                return dept ? (
                                  <span
                                    key={deptId}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                                  >
                                    {dept.name}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setLeaveTypeForm({
                                          ...leaveTypeForm,
                                          applicableTo: {
                                            ...leaveTypeForm.applicableTo,
                                            departments: (
                                              leaveTypeForm.applicableTo
                                                .departments || []
                                            ).filter((id) => id !== deptId),
                                          },
                                        })
                                      }}
                                      className="hover:text-emerald-900"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </span>
                                ) : null
                              }
                            )}
                          </div>
                        )}
                        {/* Dropdown */}
                        <select
                          value=""
                          onChange={(e) => {
                            if (
                              e.target.value &&
                              !(
                                leaveTypeForm.applicableTo.departments || []
                              ).includes(e.target.value)
                            ) {
                              setLeaveTypeForm({
                                ...leaveTypeForm,
                                applicableTo: {
                                  ...leaveTypeForm.applicableTo,
                                  departments: [
                                    ...(leaveTypeForm.applicableTo
                                      .departments || []),
                                    e.target.value,
                                  ],
                                },
                              })
                            }
                          }}
                          className="w-full p-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">+ Add department...</option>
                          {departments
                            .filter(
                              (dept) =>
                                !(
                                  leaveTypeForm.applicableTo.departments || []
                                ).includes(dept._id)
                            )
                            .map((dept) => (
                              <option key={dept._id} value={dept._id}>
                                {dept.name}
                              </option>
                            ))}
                        </select>
                        {(leaveTypeForm.applicableTo.departments || [])
                          .length === 0 && (
                          <p className="text-xs text-slate-500 mt-2">
                            Leave empty to apply to all departments
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Designations Multi-Select */}
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-700">
                        Designations
                      </Label>
                      <div className="border border-slate-300 rounded-lg bg-white p-3">
                        {/* Selected Designations as Chips */}
                        {(leaveTypeForm.applicableTo.designations || [])
                          .length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(
                              leaveTypeForm.applicableTo.designations || []
                            ).map((desigId) => {
                              const desig = designations.find(
                                (d) => d._id === desigId
                              )
                              return desig ? (
                                <span
                                  key={desigId}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                  {desig.name}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setLeaveTypeForm({
                                        ...leaveTypeForm,
                                        applicableTo: {
                                          ...leaveTypeForm.applicableTo,
                                          designations: (
                                            leaveTypeForm.applicableTo
                                              .designations || []
                                          ).filter((id) => id !== desigId),
                                        },
                                      })
                                    }}
                                    className="hover:text-blue-900"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              ) : null
                            })}
                          </div>
                        )}
                        {/* Dropdown */}
                        <select
                          value=""
                          onChange={(e) => {
                            if (
                              e.target.value &&
                              !(
                                leaveTypeForm.applicableTo.designations || []
                              ).includes(e.target.value)
                            ) {
                              setLeaveTypeForm({
                                ...leaveTypeForm,
                                applicableTo: {
                                  ...leaveTypeForm.applicableTo,
                                  designations: [
                                    ...(leaveTypeForm.applicableTo
                                      .designations || []),
                                    e.target.value,
                                  ],
                                },
                              })
                            }
                          }}
                          className="w-full p-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">+ Add designation...</option>
                          {designations
                            .filter(
                              (desig) =>
                                !(
                                  leaveTypeForm.applicableTo.designations || []
                                ).includes(desig._id)
                            )
                            .map((desig) => (
                              <option key={desig._id} value={desig._id}>
                                {desig.name}
                              </option>
                            ))}
                        </select>
                        {(leaveTypeForm.applicableTo.designations || [])
                          .length === 0 && (
                          <p className="text-xs text-slate-500 mt-2">
                            Leave empty to apply to all designations
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {saving ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : editingLeaveType ? (
                        "Update Leave Type"
                      ) : (
                        "Create Leave Type"
                      )}
                    </Button>
                    {editingLeaveType && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetLeaveTypeForm}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Leave Types List */}
            <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-slate-900">
                  <span>Leave Types ({leaveTypes.length})</span>
                  <Button
                    onClick={loadData}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  </div>
                ) : leaveTypes.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No leave types found</p>
                    <p className="text-sm">
                      Create your first leave type to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {leaveTypes.map((leaveType) => (
                      <div
                        key={leaveType._id}
                        className="border border-slate-200 rounded-lg bg-white p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-slate-900">
                              {leaveType.name} ({leaveType.code})
                            </h3>
                            <p className="text-sm text-slate-600">
                              {leaveType.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  leaveType.isPaid
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {leaveType.isPaid ? "Paid" : "Unpaid"}
                              </span>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Default: {leaveType.defaultDays} days
                              </span>
                              {leaveType.maxConsecutiveDays &&
                                leaveType.maxConsecutiveDays > 0 && (
                                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                    Max: {leaveType.maxConsecutiveDays} days
                                  </span>
                                )}
                              {leaveType.minNoticeDays &&
                                leaveType.minNoticeDays > 0 && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    Notice: {leaveType.minNoticeDays} days
                                  </span>
                                )}
                              {leaveType.probationPeriodMonths &&
                                leaveType.probationPeriodMonths > 0 && (
                                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                    Probation: {leaveType.probationPeriodMonths}{" "}
                                    months
                                  </span>
                                )}
                              {leaveType.applicableTo?.departments &&
                                leaveType.applicableTo.departments.length >
                                  0 && (
                                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                                    {leaveType.applicableTo.departments.length}{" "}
                                    Departments
                                  </span>
                                )}
                              {leaveType.applicableTo?.designations &&
                                leaveType.applicableTo.designations.length >
                                  0 && (
                                  <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">
                                    {leaveType.applicableTo.designations.length}{" "}
                                    Designations
                                  </span>
                                )}
                              {leaveType.applicableTo?.minimumLevel &&
                                leaveType.applicableTo.minimumLevel > 0 && (
                                  <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded">
                                    Min Level:{" "}
                                    {leaveType.applicableTo.minimumLevel}
                                  </span>
                                )}
                              {leaveType.applicableTo
                                ?.minimumServicePeriodMonths &&
                                leaveType.applicableTo
                                  .minimumServicePeriodMonths > 0 && (
                                  <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                                    Service:{" "}
                                    {
                                      leaveType.applicableTo
                                        .minimumServicePeriodMonths
                                    }{" "}
                                    months
                                  </span>
                                )}
                              {leaveType.isCarryForward && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Carry Forward
                                </span>
                              )}
                              {leaveType.requiresApproval && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  Requires Approval
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditLeaveType(leaveType)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDeleteLeaveType(leaveType._id)
                              }
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Holidays Tab */}
        {activeTab === "holidays" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Holiday Form */}
            <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900">
                  <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
                  {editingHoliday ? "Edit Holiday" : "Add New Holiday"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHolidaySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="holidayName">Holiday Name *</Label>
                    <Input
                      id="holidayName"
                      value={holidayForm.name}
                      onChange={(e) =>
                        setHolidayForm({
                          ...holidayForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter holiday name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="holidayDate">Date *</Label>
                    <Input
                      id="holidayDate"
                      type="date"
                      value={holidayForm.date}
                      onChange={(e) =>
                        setHolidayForm({
                          ...holidayForm,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="holidayType">Holiday Type</Label>
                    <select
                      id="holidayType"
                      value={holidayForm.type}
                      onChange={(e) =>
                        setHolidayForm({
                          ...holidayForm,
                          type: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="National">National</option>
                      <option value="Company">Company</option>
                      <option value="Religious">Religious</option>
                      <option value="Observance">Observance</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="holidayDescription">Description</Label>
                    <Textarea
                      id="holidayDescription"
                      value={holidayForm.description}
                      onChange={(e) =>
                        setHolidayForm({
                          ...holidayForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter holiday description"
                      rows={3}
                    />
                  </div>

                  {/* Is Paid Toggle */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPaid"
                      checked={holidayForm.isPaid}
                      onChange={(e) =>
                        setHolidayForm({
                          ...holidayForm,
                          isPaid: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <Label htmlFor="isPaid">Paid Holiday</Label>
                  </div>

                  {/* Applicable To Section - Clean Multi-Select */}
                  <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-medium text-slate-900 flex items-center gap-2">
                      <Users className="h-4 w-4 text-emerald-600" />
                      Applicable To (Optional)
                    </h4>

                    {/* Departments Multi-Select */}
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-700">
                        Departments
                      </Label>
                      <div className="border border-slate-300 rounded-lg bg-white p-3">
                        {/* Selected Departments as Chips */}
                        {(holidayForm.applicableTo.departments || []).length >
                          0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(holidayForm.applicableTo.departments || []).map(
                              (deptId) => {
                                const dept = departments.find(
                                  (d) => d._id === deptId
                                )
                                return dept ? (
                                  <span
                                    key={deptId}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                                  >
                                    {dept.name}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setHolidayForm({
                                          ...holidayForm,
                                          applicableTo: {
                                            ...holidayForm.applicableTo,
                                            departments: (
                                              holidayForm.applicableTo
                                                .departments || []
                                            ).filter((id) => id !== deptId),
                                          },
                                        })
                                      }}
                                      className="hover:text-emerald-900"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </span>
                                ) : null
                              }
                            )}
                          </div>
                        )}
                        {/* Dropdown */}
                        <select
                          value=""
                          onChange={(e) => {
                            if (
                              e.target.value &&
                              !(
                                holidayForm.applicableTo.departments || []
                              ).includes(e.target.value)
                            ) {
                              setHolidayForm({
                                ...holidayForm,
                                applicableTo: {
                                  ...holidayForm.applicableTo,
                                  departments: [
                                    ...(holidayForm.applicableTo.departments ||
                                      []),
                                    e.target.value,
                                  ],
                                },
                              })
                            }
                          }}
                          className="w-full p-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">+ Add department...</option>
                          {departments
                            .filter(
                              (dept) =>
                                !(
                                  holidayForm.applicableTo.departments || []
                                ).includes(dept._id)
                            )
                            .map((dept) => (
                              <option key={dept._id} value={dept._id}>
                                {dept.name}
                              </option>
                            ))}
                        </select>
                        {(holidayForm.applicableTo.departments || []).length ===
                          0 && (
                          <p className="text-xs text-slate-500 mt-2">
                            Leave empty to apply to all departments
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Designations Multi-Select */}
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-700">
                        Designations
                      </Label>
                      <div className="border border-slate-300 rounded-lg bg-white p-3">
                        {/* Selected Designations as Chips */}
                        {(holidayForm.applicableTo.designations || []).length >
                          0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(holidayForm.applicableTo.designations || []).map(
                              (desigId) => {
                                const desig = designations.find(
                                  (d) => d._id === desigId
                                )
                                return desig ? (
                                  <span
                                    key={desigId}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                  >
                                    {desig.name}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setHolidayForm({
                                          ...holidayForm,
                                          applicableTo: {
                                            ...holidayForm.applicableTo,
                                            designations: (
                                              holidayForm.applicableTo
                                                .designations || []
                                            ).filter((id) => id !== desigId),
                                          },
                                        })
                                      }}
                                      className="hover:text-blue-900"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </span>
                                ) : null
                              }
                            )}
                          </div>
                        )}
                        {/* Dropdown */}
                        <select
                          value=""
                          onChange={(e) => {
                            if (
                              e.target.value &&
                              !(
                                holidayForm.applicableTo.designations || []
                              ).includes(e.target.value)
                            ) {
                              setHolidayForm({
                                ...holidayForm,
                                applicableTo: {
                                  ...holidayForm.applicableTo,
                                  designations: [
                                    ...(holidayForm.applicableTo.designations ||
                                      []),
                                    e.target.value,
                                  ],
                                },
                              })
                            }
                          }}
                          className="w-full p-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">+ Add designation...</option>
                          {designations
                            .filter(
                              (desig) =>
                                !(
                                  holidayForm.applicableTo.designations || []
                                ).includes(desig._id)
                            )
                            .map((desig) => (
                              <option key={desig._id} value={desig._id}>
                                {desig.name}
                              </option>
                            ))}
                        </select>
                        {(holidayForm.applicableTo.designations || [])
                          .length === 0 && (
                          <p className="text-xs text-slate-500 mt-2">
                            Leave empty to apply to all designations
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recurring Holiday Section */}
                  <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isRecurring"
                        checked={holidayForm.isRecurring}
                        onChange={(e) =>
                          setHolidayForm({
                            ...holidayForm,
                            isRecurring: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <Label htmlFor="isRecurring">Recurring Holiday</Label>
                    </div>

                    {holidayForm.isRecurring && (
                      <div className="space-y-2 ml-6">
                        <Label htmlFor="recurrencePattern">
                          Recurrence Pattern
                        </Label>
                        <select
                          id="recurrencePattern"
                          value={holidayForm.recurrencePattern}
                          onChange={(e) => {
                            const pattern = e.target.value
                            setHolidayForm({
                              ...holidayForm,
                              recurrencePattern: pattern,
                              recurringRule: {
                                ...holidayForm.recurringRule,
                                frequency: pattern.toLowerCase(),
                              },
                            })
                          }}
                          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="Yearly">Yearly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Weekly">Weekly</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {saving ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : editingHoliday ? (
                        "Update Holiday"
                      ) : (
                        "Create Holiday"
                      )}
                    </Button>
                    {editingHoliday && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetHolidayForm}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Holidays List */}
            <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-slate-900">
                  <span>Holidays ({holidays.length})</span>
                  <Button
                    onClick={loadData}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  </div>
                ) : holidays.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No holidays found</p>
                    <p className="text-sm">
                      Create your first holiday to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {holidays.map((holiday) => (
                      <div
                        key={holiday._id}
                        className="border border-slate-200 rounded-lg bg-white p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-slate-900">
                              {holiday.name}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {new Date(holiday.date).toLocaleDateString()} •{" "}
                              {holiday.type}
                            </p>
                            {holiday.description && (
                              <p className="text-sm text-slate-500 mt-1">
                                {holiday.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {holiday.type}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  holiday.isPaid
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {holiday.isPaid ? "Paid" : "Unpaid"}
                              </span>
                              {holiday.isRecurring && (
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  Recurring
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditHoliday(holiday)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteHoliday(holiday._id)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
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
