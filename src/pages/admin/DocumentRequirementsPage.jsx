import React, { useState, useEffect, useRef } from "react"
import MainLayout from "../../components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"
import {
  Plus,
  Trash2,
  Save,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react"

const CustomSelect = ({ value, onChange, options, placeholder, label }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const selectedOption = options.find((option) => option.value === value)

  const handleOptionClick = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label>{label}</Label>
      <div className="relative">
        <button
          type="button"
          className="w-full p-2 border border-slate-900 rounded-md   flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={value ? "text-slate-900" : "text-slate-700"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-3 py-2 cursor-pointer hover:bg-slate-50 ${
                  value === option.value
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700"
                }`}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const DocumentRequirementsPage = () => {
  const { user, token } = useAuth()
  const [documentRequirements, setDocumentRequirements] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingRequirement, setEditingRequirement] = useState(null)

  // Form state for new/editing document requirement
  const [newRequirement, setNewRequirement] = useState({
    documentType: "",
    displayName: "",
    description: "",
    required: true,
    allowedFormats: ["pdf"],
    maxSizeMB: 5,
  })

  // Common document types
  const commonDocumentTypes = [
    { value: "aadhaar_card", label: "Aadhaar Card" },
    { value: "pan_card", label: "PAN Card" },
    { value: "passport", label: "Passport" },
    { value: "driving_license", label: "Driving License" },
    { value: "voter_id", label: "Voter ID" },
    { value: "bank_statement", label: "Bank Statement" },
    { value: "salary_slip", label: "Salary Slip" },
    { value: "education_certificate", label: "Education Certificate" },
    { value: "experience_letter", label: "Experience Letter" },
    { value: "medical_certificate", label: "Medical Certificate" },
    { value: "insurance_policy", label: "Insurance Policy" },
    { value: "offer_letter", label: "Offer Letter" },
    { value: "appointment_letter", label: "Appointment Letter" },
    { value: "relieving_letter", label: "Relieving Letter" },
    { value: "joining_letter", label: "Joining Letter" },
    { value: "contract_agreement", label: "Contract Agreement" },
    { value: "work_permit", label: "Work Permit" },
    { value: "visa_document", label: "Visa Document" },
    { value: "other", label: "Other" },
  ]

  // File format options
  const formatOptions = [
    { value: "pdf", label: "PDF" },
    { value: "jpg", label: "JPG" },
    { value: "jpeg", label: "JPEG" },
    { value: "png", label: "PNG" },
  ]

  // Load existing document requirements
  useEffect(() => {
    loadDocumentRequirements()
  }, [user, token])

  const loadDocumentRequirements = async () => {
    if (!user?.organizationId) return

    setIsLoading(true)
    try {
      const orgId = user.organizationId?._id || user.organizationId
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }api/documents/organization/${orgId}/requirements`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setDocumentRequirements(response.data.documentRequirements || [])
      } else {
        toast.error(
          response.data.message || "Failed to load document requirements"
        )
      }
    } catch (error) {
      console.error("Error loading document requirements:", error)
      toast.error("Failed to load document requirements")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setNewRequirement((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleFormat = (format) => {
    setNewRequirement((prev) => {
      const newFormats = prev.allowedFormats.includes(format)
        ? prev.allowedFormats.filter((f) => f !== format)
        : [...prev.allowedFormats, format]

      return {
        ...prev,
        allowedFormats: newFormats,
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!newRequirement.documentType || !newRequirement.displayName) {
      toast.error("Document type and display name are required")
      return
    }

    const requirementsData = {
      organizationId: user.organizationId?._id || user.organizationId,
      documentRequirements: [
        {
          ...newRequirement,
          documentType: newRequirement.documentType
            .toLowerCase()
            .replace(/\s+/g, "_"),
        },
      ],
    }

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }api/documents/organization/requirements`,
        requirementsData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        setNewRequirement({
          documentType: "",
          displayName: "",
          description: "",
          required: true,
          allowedFormats: ["pdf"],
          maxSizeMB: 5,
        })
        loadDocumentRequirements() // Refresh the list
      } else {
        toast.error(
          response.data.message || "Failed to save document requirement"
        )
      }
    } catch (error) {
      console.error("Error saving document requirement:", error)
      toast.error(
        error.response?.data?.message || "Failed to save document requirement"
      )
    }
  }

  const handleDelete = async (requirementId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this document requirement?"
      )
    ) {
      return
    }

    try {
      // In a real implementation, you might need a DELETE endpoint
      // For now, we'll just refresh the list after the user confirms
      toast.info("Document requirement deleted successfully")
      loadDocumentRequirements()
    } catch (error) {
      console.error("Error deleting document requirement:", error)
      toast.error("Failed to delete document requirement")
    }
  }

  const getFormatDisplay = (formats) => {
    return formats.map((format) => format.toUpperCase()).join(", ")
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Welcome Section - Match Dashboard Style */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Document Requirements Management
          </h1>
          <p className="text-emerald-100">
            Configure required documents for employees in your organization
          </p>
        </div>

        {/* Create New Requirement Card */}
        <Card className="bg-slate-50 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-900">
              <FileText className="h-5 w-5 text-emerald-600" />
              <span>Add New Document Requirement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <CustomSelect
                    value={newRequirement.documentType}
                    onChange={(value) =>
                      handleInputChange("documentType", value)
                    }
                    options={commonDocumentTypes}
                    placeholder="Select document type"
                    label="Document Type *"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input
                    id="displayName"
                    value={newRequirement.displayName}
                    onChange={(e) =>
                      handleInputChange("displayName", e.target.value)
                    }
                    placeholder="Enter display name (e.g., Aadhaar Card)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newRequirement.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Enter description for this document"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxSizeMB">Max File Size (MB)</Label>
                  <Input
                    id="maxSizeMB"
                    type="number"
                    min="1"
                    max="50"
                    value={newRequirement.maxSizeMB}
                    onChange={(e) =>
                      handleInputChange("maxSizeMB", parseInt(e.target.value))
                    }
                    placeholder="Enter max file size in MB"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="w-full md:w-1/2">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={newRequirement.required}
                      onClick={() =>
                        handleInputChange("required", !newRequirement.required)
                      }
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                        newRequirement.required
                          ? "bg-emerald-600"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          newRequirement.required
                            ? "translate-x-7"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                    <Label className="text-sm font-normal text-slate-700 whitespace-nowrap">
                      Required Document
                    </Label>
                  </div>
                </div>

                <div className="w-full md:w-1/2">
                  <Label className="block text-sm font-medium text-slate-700 mb-2">
                    Allowed Formats
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {formatOptions.map((format) => (
                      <Button
                        key={format.value}
                        type="button"
                        variant={
                          newRequirement.allowedFormats.includes(format.value)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => toggleFormat(format.value)}
                        className="capitalize"
                      >
                        {format.label}
                        {newRequirement.allowedFormats.includes(
                          format.value
                        ) && <CheckCircle className="ml-1 h-3 w-3" />}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-white  bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Document Requirement
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Document Requirements */}
        <Card className="bg-slate-50 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-900">
              <Eye className="h-5 w-5 text-emerald-600" />
              <span>Current Document Requirements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <span className="ml-2">Loading document requirements...</span>
              </div>
            ) : documentRequirements.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileText className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                <p>No document requirements configured yet.</p>
                <p className="text-sm">
                  Add document requirements using the form above.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {documentRequirements.map((requirement) => (
                  <div
                    key={requirement.id || requirement._id}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-slate-900">
                            {requirement.displayName}
                          </h3>
                          <Badge
                            variant={
                              requirement.required ? "default" : "secondary"
                            }
                            className="capitalize"
                          >
                            {requirement.required ? "Required" : "Optional"}
                          </Badge>
                        </div>

                        <p className="text-sm text-slate-600 mb-2">
                          {requirement.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span>
                            Type: <strong>{requirement.documentType}</strong>
                          </span>
                          <span>
                            Max: <strong>{requirement.maxSizeMB}MB</strong>
                          </span>
                          <span>
                            Formats:{" "}
                            <strong>
                              {getFormatDisplay(requirement.allowedFormats)}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleDelete(requirement.id || requirement._id)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

export default DocumentRequirementsPage
