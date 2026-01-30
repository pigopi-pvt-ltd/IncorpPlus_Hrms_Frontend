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
import { toast } from "@/components/ui/toast"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"
import {
  Settings,
  Clock,
  Calendar,
  Users,
  Building,
  Save,
  RefreshCw,
} from "lucide-react"

const OrganizationConfigurationPage = () => {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [organization, setOrganization] = useState({
    id: "",
    name: "",
    location: "",
    description: "",
    workingDays: [],
    workHoursPerDay: 8,
    isActive: true,
    createdAt: "",
  })

  const [formData, setFormData] = useState({
    workingDays: [],
    workHoursPerDay: 8,
  })

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]

  useEffect(() => {
    loadOrganizationDetails()
  }, [user, token])

  const loadOrganizationDetails = async () => {
    if (!user?.organizationId) return

    setLoading(true)
    try {
      const orgId = user.organizationId?._id || user.organizationId
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}api/auth/organizations/${orgId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        const orgData = response.data.organization
        setOrganization(orgData)
        setFormData({
          workingDays: orgData.workingDays || [],
          workHoursPerDay: orgData.workHoursPerDay || 8,
        })
      } else {
        toast.error(
          response.data.message || "Failed to load organization details"
        )
      }
    } catch (error) {
      console.error("Error loading organization details:", error)
      // Handle different error response formats
      let errorMessage = "Failed to load organization details"
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

  const handleWorkingDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }))
  }

  const handleWorkHoursChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      workHoursPerDay: parseInt(value) || 8,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.workingDays.length === 0) {
      toast.error("Please select at least one working day")
      return
    }

    if (formData.workHoursPerDay <= 0 || formData.workHoursPerDay > 24) {
      toast.error("Work hours per day must be between 1 and 24")
      return
    }

    setSaving(true)
    try {
      const orgId = user.organizationId?._id || user.organizationId
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}api/auth/organizations/${orgId}`,
        {
          name: organization.name,
          location: organization.location,
          description: organization.description,
          workingDays: formData.workingDays,
          workHoursPerDay: formData.workHoursPerDay,
          isActive: organization.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Organization configuration updated successfully"
        )
        setOrganization((prev) => ({
          ...prev,
          workingDays: formData.workingDays,
          workHoursPerDay: formData.workHoursPerDay,
          updatedAt: response.data.organization?.updatedAt,
        }))
      } else {
        // Handle different error response formats
        let errorMessage = "Failed to update organization configuration"
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
      console.error("Error updating organization:", error)
      // Handle different error response formats
      let errorMessage = "Failed to update organization configuration"
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
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
            <Settings className="h-8 w-8 text-emerald-600" />
            Organization Configuration
          </h1>
          <p className="text-slate-600 mt-2">
            Configure working days, hours, and other organization settings
          </p>
        </div>

        {/* Organization Info Card */}
        <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Building className="h-5 w-5 text-emerald-600" />
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-slate-600">
                  Name
                </Label>
                <p className="text-slate-900 font-medium">
                  {organization.name}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-slate-600">
                  Location
                </Label>
                <p className="text-slate-900 font-medium">
                  {organization.location}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-slate-600">
                  Status
                </Label>
                <p
                  className={`text-sm font-medium ${
                    organization.isActive ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {organization.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Days Configuration */}
        <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Calendar className="h-5 w-5 text-emerald-600" />
              Working Days Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-3 block">
                  Select Working Days
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`day-${day.toLowerCase()}`}
                        checked={formData.workingDays.includes(day)}
                        onChange={() => handleWorkingDayToggle(day)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <Label
                        htmlFor={`day-${day.toLowerCase()}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Hours Per Day */}
              <div className="space-y-2">
                <Label
                  htmlFor="workHoursPerDay"
                  className="text-sm font-medium text-slate-700"
                >
                  Work Hours Per Day
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="workHoursPerDay"
                    type="number"
                    min="1"
                    max="24"
                    value={formData.workHoursPerDay}
                    onChange={(e) => handleWorkHoursChange(e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm text-slate-600">hours</span>
                </div>
                <p className="text-xs text-slate-500">
                  Specify the standard work hours per working day
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Configuration
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={loadOrganizationDetails}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Configuration Summary */}
        <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Clock className="h-5 w-5 text-emerald-600" />
              Current Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600">
                  Working Days
                </Label>
                <p className="text-slate-900">
                  {formData.workingDays.length > 0
                    ? formData.workingDays.join(", ")
                    : "No working days selected"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600">
                  Hours Per Day
                </Label>
                <p className="text-slate-900">
                  {formData.workHoursPerDay} hours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

export default OrganizationConfigurationPage
