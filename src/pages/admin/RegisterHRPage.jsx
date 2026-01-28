import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../../components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"
import {
  ArrowLeft,
  ArrowRight,
  User,
  Building,
  Briefcase,
  Home,
  Mail,
  Phone,
  Lock,
  Search,
  ChevronDown,
} from "lucide-react"

const countryCodes = [
  { code: "+91", name: "India" },
  { code: "+1", name: "USA" },
  { code: "+44", name: "UK" },
  { code: "+49", name: "Germany" },
  { code: "+33", name: "France" },
  { code: "+81", name: "Japan" },
  { code: "+86", name: "China" },
  { code: "+61", name: "Australia" },
  { code: "+7", name: "Russia" },
  { code: "+55", name: "Brazil" },
  { code: "+34", name: "Spain" },
  { code: "+39", name: "Italy" },
]

const AutoCompleteInput = ({
  value,
  onChange,
  options,
  placeholder,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [inputValue, setInputValue] = useState("")
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (value) {
      const selectedOption = options.find((option) => option.code === value)
      if (selectedOption) {
        setInputValue(`${selectedOption.code} (${selectedOption.name})`)
      }
    }
  }, [value, options])

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)

    if (value.trim()) {
      const filtered = options.filter(
        (option) =>
          option.name.toLowerCase().includes(value.toLowerCase()) ||
          option.code.includes(value.replace("+", ""))
      )
      setFilteredOptions(filtered)
      setIsOpen(true)
    } else {
      setFilteredOptions(options)
      setIsOpen(false)
    }
  }

  const handleSelect = (option) => {
    setInputValue(`${option.code} (${option.name})`)
    onChange(option.code)
    setIsOpen(false)
  }

  const handleInputClick = () => {
    if (!inputValue) {
      setFilteredOptions(options)
      setIsOpen(true)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          className="pr-10"
        />
        <ChevronDown
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.code}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleSelect(option)}
              >
                <span className="font-mono">{option.code}</span>
                <span className="ml-2">{option.name}</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  )
}

const RegisterHRPage = () => {
  const { user, token } = useAuth()

  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    countryCode: "+91",
    username: "",
    password: "",
    location: "",
    department: "", // Will be dropdown
    designation: "", // Will be dropdown
    dateOfJoining: "",
    reportingManager: "",
    address: "",
    emergencyContact: "",
  })

  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [filteredDesignations, setFilteredDesignations] = useState([])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [documentRequirements, setDocumentRequirements] = useState([])

  const totalSteps = 4

  useEffect(() => {
    loadDocumentRequirements()
    loadMasterData()
  }, [user, token])

  const loadMasterData = async () => {
    if (!user?.organizationId) return

    try {
      const orgId = user.organizationId?._id || user.organizationId

      // Load departments
      const deptResponse = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }api/masterdata/organizations/${orgId}/departments?includeInactive=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (deptResponse.data.success) {
        setDepartments(deptResponse.data.departments || [])
      }

      // Load designations
      const desigResponse = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }api/masterdata/organizations/${orgId}/designations?includeInactive=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (desigResponse.data.success) {
        setDesignations(desigResponse.data.designations || [])
      }
    } catch (error) {
      console.error("Error loading master data:", error)
      toast.error("Failed to load master data")
    }
  }

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

  const validateStep = (stepNumber) => {
    let isValid = true
    const newErrors = {}

    switch (stepNumber) {
      case 1: // Personal Information
        if (!formData.firstName.trim()) {
          newErrors.firstName = "First name is required"
          isValid = false
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = "Last name is required"
          isValid = false
        }
        if (!formData.email.trim()) {
          newErrors.email = "Email is required"
          isValid = false
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Email is invalid"
          isValid = false
        }
        if (!formData.mobile.trim()) {
          newErrors.mobile = "Mobile number is required"
          isValid = false
        } else if (!/^\d{10}$/.test(formData.mobile)) {
          newErrors.mobile = "Mobile number must be 10 digits"
          isValid = false
        }
        if (!formData.countryCode.trim()) {
          newErrors.countryCode = "Country code is required"
          isValid = false
        }
        break

      case 2: // Account Information
        if (!formData.username.trim()) {
          newErrors.username = "Username is required"
          isValid = false
        } else if (formData.username.length < 3) {
          newErrors.username = "Username must be at least 3 characters"
          isValid = false
        }
        if (!formData.password.trim()) {
          newErrors.password = "Password is required"
          isValid = false
        } else if (formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters"
          isValid = false
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password =
            "Password must contain uppercase, lowercase, and number"
          isValid = false
        }
        if (!formData.location.trim()) {
          newErrors.location = "Location is required"
          isValid = false
        }
        break

      case 3: // Employment Details
        if (
          formData.dateOfJoining &&
          new Date(formData.dateOfJoining) > new Date()
        ) {
          newErrors.dateOfJoining = "Joining date cannot be in the future"
          isValid = false
        }
        break

      case 4: // Additional Information
        if (
          formData.emergencyContact &&
          !/^\d{10}$/.test(formData.emergencyContact)
        ) {
          newErrors.emergencyContact = "Emergency contact must be 10 digits"
          isValid = false
        }
        break
    }

    setErrors(newErrors)
    return isValid
  }

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < totalSteps) setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Filter designations when department changes
    if (field === "department") {
      const filtered = designations.filter(
        (designation) =>
          designation.departmentId?.id === value ||
          designation.departmentId === value
      )
      setFilteredDesignations(filtered)
      // Clear designation if department changes
      setFormData((prev) => ({ ...prev, designation: "" }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleCountryCodeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      countryCode: value,
    }))

    // Clear error when user selects an option
    if (errors.countryCode) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.countryCode
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate all required fields before final submission
    if (
      !validateStep(1) ||
      !validateStep(2) ||
      !validateStep(3) ||
      !validateStep(4)
    ) {
      toast.error("Please fix all errors before submitting")
      return
    }

    setLoading(true)

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || ""
      const apiUrl = baseUrl.endsWith("/")
        ? `${baseUrl}api/auth/register/hr`
        : `${baseUrl}/api/auth/register/hr`

      const response = await axios.post(
        apiUrl,
        {
          username: formData.username,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: "HR", // Always HR for this form
          organizationId: formData.organizationId, // This is automatically set from user context
          location: formData.location,
          countryCode: formData.countryCode,
          department: formData.department,
          designation: formData.designation,
          dateOfJoining: formData.dateOfJoining,
          address: formData.address,
          reportingManager: formData.reportingManager,
          emergencyContact: formData.emergencyContact,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      toast.success(response.data.message)

      // Reset form
      setFormData({
        username: "",
        email: "",
        mobile: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "HR", // Always HR for this form
        organizationId: user?.organizationId?._id || user?.organizationId || "", // Reset to user's org - use _id if available
        location: "",
        countryCode: "+91", // Reset to default
        department: "",
        designation: "",
        dateOfJoining: "",
        address: "",
        reportingManager: "",
        emergencyContact: "",
      })

      setErrors({})
      setStep(1) // Go back to first step
      // Optionally navigate back to dashboard or HR management page
      // navigate("/super-admin/users");
    } catch (error) {
      console.error("Registration error:", error)
      // Handle different types of errors
      let errorMessage = "Failed to register HR user"
      if (error.response) {
        // Server responded with error status
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
        // Request was made but no response received
        errorMessage =
          "Network error: Unable to connect to server. Please check your connection."
      } else {
        // Something else happened
        errorMessage = error.message || "An unexpected error occurred"
      }
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-emerald-600 mb-4">
              <User className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  required
                  placeholder="Enter first name"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  required
                  placeholder="Enter last name"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  placeholder="Enter email address"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  required
                  placeholder="Enter mobile number"
                  className={errors.mobile ? "border-red-500" : ""}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm">{errors.mobile}</p>
                )}
              </div>

              <div className="space-y-2">
                <AutoCompleteInput
                  value={formData.countryCode}
                  onChange={handleCountryCodeChange}
                  options={countryCodes}
                  placeholder="Search country code..."
                  label="Country Code *"
                />
                {errors.countryCode && (
                  <p className="text-red-500 text-sm">{errors.countryCode}</p>
                )}
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-emerald-600 mb-4">
              <Lock className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Account Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  required
                  placeholder="Enter username"
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                  placeholder="Enter password"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Removed the role selection field - it's now always HR */}

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  required
                  placeholder="Enter location"
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">{errors.location}</p>
                )}
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-emerald-600 mb-4">
              <Briefcase className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Employment Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.department ? "border-red-500" : "border-slate-300"
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-500 text-sm">{errors.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation *</Label>
                <select
                  id="designation"
                  value={formData.designation}
                  onChange={(e) =>
                    handleInputChange("designation", e.target.value)
                  }
                  disabled={!formData.department}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.designation ? "border-red-500" : "border-slate-300"
                  } ${
                    !formData.department
                      ? "bg-slate-100 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <option value="">Select Designation</option>
                  {(formData.department
                    ? filteredDesignations
                    : designations
                  ).map((desig) => (
                    <option key={desig.id} value={desig.id}>
                      {desig.name} {desig.level && `(Level ${desig.level})`}
                    </option>
                  ))}
                </select>
                {!formData.department && (
                  <p className="text-slate-500 text-sm">
                    Please select a department first
                  </p>
                )}
                {errors.designation && (
                  <p className="text-red-500 text-sm">{errors.designation}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfJoining">Date of Joining</Label>
                <Input
                  id="dateOfJoining"
                  name="dateOfJoining"
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) =>
                    handleInputChange("dateOfJoining", e.target.value)
                  }
                  placeholder="Select date"
                  className={errors.dateOfJoining ? "border-red-500" : ""}
                />
                {errors.dateOfJoining && (
                  <p className="text-red-500 text-sm">{errors.dateOfJoining}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportingManager">Reporting Manager</Label>
                <Input
                  id="reportingManager"
                  name="reportingManager"
                  value={formData.reportingManager}
                  onChange={(e) =>
                    handleInputChange("reportingManager", e.target.value)
                  }
                  placeholder="Enter reporting manager"
                />
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-emerald-600 mb-4">
              <Home className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Additional Information</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    handleInputChange("emergencyContact", e.target.value)
                  }
                  placeholder="Enter emergency contact"
                  className={errors.emergencyContact ? "border-red-500" : ""}
                />
                {errors.emergencyContact && (
                  <p className="text-red-500 text-sm">
                    {errors.emergencyContact}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">
                Review Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-600">Name:</span>{" "}
                  {formData.firstName} {formData.lastName}
                </div>
                <div>
                  <span className="text-slate-600">Email:</span>{" "}
                  {formData.email}
                </div>
                <div>
                  <span className="text-slate-600">Username:</span>{" "}
                  {formData.username}
                </div>
                <div>
                  <span className="text-slate-600">Role:</span> HR
                </div>
                <div>
                  <span className="text-slate-600">Location:</span>{" "}
                  {formData.location}
                </div>
                <div>
                  <span className="text-slate-600">Department:</span>{" "}
                  {formData.department || "N/A"}
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Welcome Section - Match Dashboard Style */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Register HR Manager</h1>
          <p className="text-emerald-100">
            Create a new HR user account for your organization
          </p>
        </div>

        {/* Card styled to match dashboard */}
        <div className="max-w-4xl mx-auto bg-slate-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-emerald-600" />
              <span className="text-lg font-semibold text-slate-900">
                HR Registration Form
              </span>
            </div>
            <div className="text-sm text-slate-500">
              Step {step} of {totalSteps}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-2">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Step {step}</span>
                <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Content */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
              }}
              className="space-y-6"
            >
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-slate-200 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {step === totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center"
                  >
                    {loading ? "Registering..." : "Complete Registration"}
                    <User className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default RegisterHRPage
