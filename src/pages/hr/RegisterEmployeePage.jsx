import React, { useState, useEffect } from "react"
import MainLayout from "../../components/layout/MainLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"
import {
  ArrowLeft,
  UserPlus,
  Briefcase,
  Phone,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const RegisterEmployeePage = () => {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Employment Information
    employeeId: "",
    department: "", // Will be dropdown
    position: "", // Will be dropdown (designation)
    joiningDate: "",
    employmentType: "",
    salary: "",

    // Additional Information
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
  })

  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [filteredDesignations, setFilteredDesignations] = useState([])

  const [errors, setErrors] = useState({})

  const steps = [
    { id: 1, title: "Personal Information", icon: UserPlus },
    { id: 2, title: "Employment Details", icon: Briefcase },
    { id: 3, title: "Emergency Contact", icon: Phone },
    { id: 4, title: "Review & Submit", icon: CheckCircle },
  ]

  useEffect(() => {
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

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim())
          newErrors.firstName = "First name is required"
        if (!formData.lastName.trim())
          newErrors.lastName = "Last name is required"
        if (!formData.email.trim()) {
          newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Email is invalid"
        }
        if (!formData.mobile.trim())
          newErrors.mobile = "Mobile number is required"
        if (!formData.dateOfBirth)
          newErrors.dateOfBirth = "Date of birth is required"
        if (!formData.gender) newErrors.gender = "Gender is required"
        if (!formData.address.trim()) newErrors.address = "Address is required"
        if (!formData.city.trim()) newErrors.city = "City is required"
        if (!formData.state.trim()) newErrors.state = "State is required"
        if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
        break

      case 2: // Employment Information
        if (!formData.employeeId.trim())
          newErrors.employeeId = "Employee ID is required"
        if (!formData.department.trim())
          newErrors.department = "Department is required"
        if (!formData.position.trim())
          newErrors.position = "Position is required"
        if (!formData.joiningDate)
          newErrors.joiningDate = "Joining date is required"
        if (!formData.employmentType)
          newErrors.employmentType = "Employment type is required"
        if (!formData.salary.trim()) newErrors.salary = "Salary is required"
        break

      case 3: // Emergency Contact
        if (!formData.emergencyContactName.trim())
          newErrors.emergencyContactName = "Emergency contact name is required"
        if (!formData.emergencyContactPhone.trim())
          newErrors.emergencyContactPhone =
            "Emergency contact phone is required"
        if (!formData.emergencyContactRelation.trim())
          newErrors.emergencyContactRelation =
            "Emergency contact relation is required"
        break

      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
      // Clear position if department changes
      setFormData((prev) => ({ ...prev, position: "" }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    } else {
      toast.error("Please fix the errors before proceeding")
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      toast.error("Please fix the errors before submitting")
      return
    }

    setLoading(true)

    try {
      const orgId = user.organizationId?._id || user.organizationId

      // Prepare form data according to API specification
      const submissionData = {
        username: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`, // Generate username
        email: formData.email,
        mobile: formData.mobile,
        countryCode: "+91", // Default to India, can be made configurable
        password: "SecurePassword123!", // Default password, should be changed by employee
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: "Employee", // Hardcoded as per API spec
        organizationId: orgId,
        location: `${formData.city}, ${formData.state}`, // Combine city and state
        department: formData.department,
        designation: formData.position,
        dateOfJoining: formData.joiningDate,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/auth/register/employee`,
        submissionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        toast.success("Employee registered successfully!")
        // Reset form and go back to first step
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          employeeId: "",
          department: "",
          position: "",
          joiningDate: "",
          employmentType: "",
          salary: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          emergencyContactRelation: "",
        })
        setErrors({})
        setCurrentStep(1)
      } else {
        toast.error(response.data.message || "Failed to register employee")
      }
    } catch (error) {
      console.error("Error registering employee:", error)
      toast.error(
        "Failed to register employee. Please check all fields are correct."
      )
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
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
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
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
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
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
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                className={errors.mobile ? "border-red-500" : ""}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                className={errors.dateOfBirth ? "border-red-500" : ""}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.gender ? "border-red-500" : "border-slate-300"
                }`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender}</p>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                className={errors.zipCode ? "border-red-500" : ""}
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm">{errors.zipCode}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) =>
                  handleInputChange("employeeId", e.target.value)
                }
                className={errors.employeeId ? "border-red-500" : ""}
              />
              {errors.employeeId && (
                <p className="text-red-500 text-sm">{errors.employeeId}</p>
              )}
            </div>

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
              <Label htmlFor="position">Designation *</Label>
              <select
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                disabled={!formData.department}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.position ? "border-red-500" : "border-slate-300"
                } ${
                  !formData.department ? "bg-slate-100 cursor-not-allowed" : ""
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
              {errors.position && (
                <p className="text-red-500 text-sm">{errors.position}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="joiningDate">Joining Date *</Label>
              <Input
                id="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={(e) =>
                  handleInputChange("joiningDate", e.target.value)
                }
                className={errors.joiningDate ? "border-red-500" : ""}
              />
              {errors.joiningDate && (
                <p className="text-red-500 text-sm">{errors.joiningDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type *</Label>
              <select
                id="employmentType"
                value={formData.employmentType}
                onChange={(e) =>
                  handleInputChange("employmentType", e.target.value)
                }
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.employmentType ? "border-red-500" : "border-slate-300"
                }`}
              >
                <option value="">Select Employment Type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
              {errors.employmentType && (
                <p className="text-red-500 text-sm">{errors.employmentType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary *</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                className={errors.salary ? "border-red-500" : ""}
              />
              {errors.salary && (
                <p className="text-red-500 text-sm">{errors.salary}</p>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Contact Name *</Label>
              <Input
                id="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={(e) =>
                  handleInputChange("emergencyContactName", e.target.value)
                }
                className={errors.emergencyContactName ? "border-red-500" : ""}
              />
              {errors.emergencyContactName && (
                <p className="text-red-500 text-sm">
                  {errors.emergencyContactName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
              <Input
                id="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={(e) =>
                  handleInputChange("emergencyContactPhone", e.target.value)
                }
                className={errors.emergencyContactPhone ? "border-red-500" : ""}
              />
              {errors.emergencyContactPhone && (
                <p className="text-red-500 text-sm">
                  {errors.emergencyContactPhone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelation">Relation *</Label>
              <Input
                id="emergencyContactRelation"
                value={formData.emergencyContactRelation}
                onChange={(e) =>
                  handleInputChange("emergencyContactRelation", e.target.value)
                }
                className={
                  errors.emergencyContactRelation ? "border-red-500" : ""
                }
              />
              {errors.emergencyContactRelation && (
                <p className="text-red-500 text-sm">
                  {errors.emergencyContactRelation}
                </p>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Review Employee Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">
                    Personal Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {formData.email}
                    </p>
                    <p>
                      <span className="font-medium">Mobile:</span>{" "}
                      {formData.mobile}
                    </p>
                    <p>
                      <span className="font-medium">Date of Birth:</span>{" "}
                      {formData.dateOfBirth}
                    </p>
                    <p>
                      <span className="font-medium">Gender:</span>{" "}
                      {formData.gender}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {formData.address}, {formData.city}, {formData.state}{" "}
                      {formData.zipCode}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-3">
                    Employment Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Employee ID:</span>{" "}
                      {formData.employeeId}
                    </p>
                    <p>
                      <span className="font-medium">Department:</span>{" "}
                      {formData.department}
                    </p>
                    <p>
                      <span className="font-medium">Position:</span>{" "}
                      {formData.position}
                    </p>
                    <p>
                      <span className="font-medium">Joining Date:</span>{" "}
                      {formData.joiningDate}
                    </p>
                    <p>
                      <span className="font-medium">Employment Type:</span>{" "}
                      {formData.employmentType}
                    </p>
                    <p>
                      <span className="font-medium">Salary:</span>{" "}
                      {formData.salary}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-medium text-slate-900 mb-3">
                    Emergency Contact
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {formData.emergencyContactName}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {formData.emergencyContactPhone}
                    </p>
                    <p>
                      <span className="font-medium">Relation:</span>{" "}
                      {formData.emergencyContactRelation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> Employee documents will be uploaded by
                the employee after they receive their login credentials.
              </p>
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Register New Employee
              </h1>
              <p className="text-slate-600">
                Step-by-step employee registration process
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : isCurrent
                        ? "border-emerald-600 text-emerald-600 bg-white"
                        : "border-slate-300 text-slate-400 bg-white"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-2 hidden md:block">
                    <p
                      className={`text-sm font-medium ${
                        isCurrent ? "text-emerald-600" : "text-slate-600"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-4 ${
                        isCompleted ? "bg-emerald-600" : "bg-slate-300"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <form className="space-y-6">
          {/* Step Content */}
          <Card className="bg-slate-50 rounded-xl shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900">
                {React.createElement(steps[currentStep - 1].icon, {
                  className: "h-5 w-5 text-emerald-600 mr-2",
                })}
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent>{renderStepContent()}</CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="border-slate-300 hover:bg-slate-100"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? "Registering..." : "Register Employee"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </MainLayout>
  )
}

export default RegisterEmployeePage
