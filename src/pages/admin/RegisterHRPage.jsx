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
    username: "",
    email: "",
    mobile: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "HR", // Always HR for this form
    organizationId: user?.organizationId?._id || user?.organizationId || "", // Hidden field, populated from user context - use _id if available
    location: "",
    countryCode: "+91", // Default to India
    department: "",
    designation: "",
    dateOfJoining: "",
    address: "",
    reportingManager: "",
    emergencyContact: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const totalSteps = 4

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
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
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to register HR user"
      )
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Enter designation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfJoining">Date of Joining</Label>
                <Input
                  id="dateOfJoining"
                  name="dateOfJoining"
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
