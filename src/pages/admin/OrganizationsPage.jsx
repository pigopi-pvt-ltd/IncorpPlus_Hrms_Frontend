import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import MainLayout from "../../components/layout/MainLayout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Badge } from "../../components/ui/badge"
import {
  Building2,
  Plus,
  Search,
  Users,
  Calendar,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Lock,
  User,
  Globe,
  MapPin,
  Phone,
  CalendarIcon,
  Loader2,
  Send,
} from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"
import { toast } from "../../components/ui/toast"

const OrganizationsPage = () => {
  const { user, role, isGlobalAdmin } = useAuth()
  const [organizations, setOrganizations] = useState([])
  const [superAdmins, setSuperAdmins] = useState([])
  const [loading, setLoading] = useState(true)

  const [newOrganization, setNewOrganization] = useState({
    name: "",
    description: "",
    location: "",
  })

  const [newSuperAdmin, setNewSuperAdmin] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    organizationId: "",
    location: "",
  })

  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false)
  const [isSuperAdminDialogOpen, setIsSuperAdminDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [creatingOrg, setCreatingOrg] = useState(false)
  const [creatingSA, setCreatingSA] = useState(false)
  const [resendingCredentials, setResendingCredentials] = useState({})

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Import unifiedAuthService to fetch data
        const unifiedAuthService = (
          await import("../../services/unifiedAuthService")
        ).default

        // Fetch organizations
        const orgResult = await unifiedAuthService.getAllOrganizations()
        console.log("Fetched organizations:", orgResult) // Debug log

        if (orgResult.success) {
          // Map MongoDB _id to id for consistency in our frontend
          const normalizedOrgs = (orgResult.organizations || []).map((org) => ({
            ...org,
            id: org._id || org.id, // Use _id if available, fallback to id
          }))
          setOrganizations(normalizedOrgs)
        } else {
          setOrganizations([])
        }

        // Fetch super admins
        const saResult = await unifiedAuthService.getAllSuperAdmins()
        console.log("Fetched super admins:", saResult) // Debug log

        if (saResult.success) {
          // Normalize super admin data
          const normalizedSAs = (saResult.superAdmins || []).map((sa) => ({
            ...sa,
            id: sa._id || sa.id, // Use _id if available, fallback to id
            firstName: sa.firstName,
            lastName: sa.lastName,
            email: sa.email,
            organization: sa.organizationId, // Will map to organization name later
            role: sa.role,
            status: sa.isActive ? "Active" : "Inactive",
            lastLogin: sa.lastLoginAt
              ? new Date(sa.lastLoginAt).toISOString().split("T")[0]
              : "Never",
            joinDate: sa.dateOfJoining
              ? new Date(sa.dateOfJoining).toISOString().split("T")[0]
              : new Date(sa.createdAt).toISOString().split("T")[0],
          }))
          setSuperAdmins(normalizedSAs)
        } else {
          setSuperAdmins([])
        }
      } catch (error) {
        console.error("Error loading data:", error)
        setOrganizations([])
        setSuperAdmins([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCreateOrganization = async (e) => {
    e.preventDefault()
    setCreatingOrg(true)

    try {
      // Import unifiedAuthService
      const unifiedAuthService = (
        await import("../../services/unifiedAuthService")
      ).default

      const orgData = {
        name: newOrganization.name,
        description: newOrganization.description,
        location: newOrganization.location,
        createdBy: user.id, // Include the authenticated user's ID
      }

      const result = await unifiedAuthService.createOrganization(orgData)

      if (result.success) {
        // Add the new organization to the list, normalize the ID
        const newOrg = {
          id:
            result.organization?._id ||
            result.organization?.id ||
            `org-${Date.now()}`,
          ...result.organization,
          name: newOrganization.name,
          description: newOrganization.description,
          location: newOrganization.location,
          createdBy: user.id,
          createdAt: new Date().toISOString().split("T")[0],
          status: "Active",
          memberCount: 0,
        }
        setOrganizations((prev) => [...prev, newOrg])
        setNewOrganization({ name: "", description: "", location: "" })
        setIsOrgDialogOpen(false)
        toast.success(result.message || "Organization created successfully!")
      } else {
        toast.error(result.message || "Failed to create organization")
      }
    } catch (error) {
      console.error("Error creating organization:", error)
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create organization"
      )
    } finally {
      setCreatingOrg(false)
    }
  }

  const handleCreateSuperAdmin = async (e) => {
    e.preventDefault()
    setCreatingSA(true)

    console.log("Current newSuperAdmin state:", newSuperAdmin) // Debug log

    try {
      // Import unifiedAuthService
      const unifiedAuthService = (
        await import("../../services/unifiedAuthService")
      ).default

      const saData = {
        username: newSuperAdmin.username,
        email: newSuperAdmin.email,
        password: newSuperAdmin.password,
        firstName: newSuperAdmin.firstName,
        lastName: newSuperAdmin.lastName,
        role: "Super_Admin",
        organizationId: newSuperAdmin.organizationId, // This is now the actual MongoDB _id
        location: newSuperAdmin.location,
      }

      console.log("Sending Super Admin data:", saData) // Debug log

      const result = await unifiedAuthService.registerSuperAdmin(saData)

      if (result.success) {
        // Add the new super admin to the list
        const newSA = {
          id: result.user?._id || result.user?.id || `sa-${Date.now()}`,
          username: newSuperAdmin.username,
          firstName: newSuperAdmin.firstName,
          lastName: newSuperAdmin.lastName,
          email: newSuperAdmin.email,
          organization:
            organizations.find(
              (org) => (org._id || org.id) === newSuperAdmin.organizationId
            )?.name || "Unknown",
          role: "Super_Admin",
          status: "Active",
          lastLogin: new Date().toISOString().split("T")[0],
          joinDate: new Date().toISOString().split("T")[0],
        }
        setSuperAdmins((prev) => [...prev, newSA])
        setNewSuperAdmin({
          username: "",
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          organizationId: "",
          location: "",
        })
        setIsSuperAdminDialogOpen(false)
        toast.success(result.message || "Super Admin created successfully!")
      } else {
        toast.error(result.message || "Failed to create super admin")
      }
    } catch (error) {
      console.error("Error creating super admin:", error)
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create super admin"
      )
    } finally {
      setCreatingSA(false)
    }
  }

  const handleResendCredentials = async (superAdminId, superAdminEmail) => {
    setResendingCredentials((prev) => ({ ...prev, [superAdminId]: true }))

    try {
      // Import unifiedAuthService
      const unifiedAuthService = (
        await import("../../services/unifiedAuthService")
      ).default

      const result = await unifiedAuthService.resendCredentials(superAdminId)

      if (result.success) {
        toast.success(
          result.message ||
            `Credentials have been resent to ${superAdminEmail}. Please check your inbox.`
        )
      } else {
        toast.error(result.message || "Failed to resend credentials")
      }
    } catch (error) {
      console.error("Error resending credentials:", error)
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to resend credentials"
      )
    } finally {
      setResendingCredentials((prev) => ({ ...prev, [superAdminId]: false }))
    }
  }

  // Map organization IDs to organization names for display
  const superAdminsWithOrgNames = superAdmins.map((sa) => ({
    ...sa,
    organization:
      organizations.find((org) => (org._id || org.id) === sa.organization)
        ?.name || "Unknown Organization",
  }))

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSuperAdmins = superAdminsWithOrgNames.filter(
    (sa) =>
      sa.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sa.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sa.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sa.organization.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isGlobalAdmin()) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-lg font-medium">Access Denied</h3>
            <p className="mt-1 text-slate-500">
              You need Global Admin privileges to access this page.
            </p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Organizations & Super Admins
            </h1>
            <p className="text-slate-600 mt-1">
              Manage organizations and super administrators
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog
              open={isSuperAdminDialogOpen}
              onOpenChange={setIsSuperAdminDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Super Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-slate-50">
                <DialogHeader>
                  <DialogTitle className="text-slate-900">
                    Create Super Admin
                  </DialogTitle>
                  <DialogDescription className="text-slate-600">
                    Add a new super admin to manage an organization
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateSuperAdmin} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-slate-700">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={newSuperAdmin.username}
                        onChange={(e) =>
                          setNewSuperAdmin({
                            ...newSuperAdmin,
                            username: e.target.value,
                          })
                        }
                        required
                        className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newSuperAdmin.email}
                        onChange={(e) =>
                          setNewSuperAdmin({
                            ...newSuperAdmin,
                            email: e.target.value,
                          })
                        }
                        required
                        className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-slate-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={newSuperAdmin.firstName}
                        onChange={(e) =>
                          setNewSuperAdmin({
                            ...newSuperAdmin,
                            firstName: e.target.value,
                          })
                        }
                        required
                        className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-slate-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={newSuperAdmin.lastName}
                        onChange={(e) =>
                          setNewSuperAdmin({
                            ...newSuperAdmin,
                            lastName: e.target.value,
                          })
                        }
                        required
                        className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={newSuperAdmin.password}
                      onChange={(e) =>
                        setNewSuperAdmin({
                          ...newSuperAdmin,
                          password: e.target.value,
                        })
                      }
                      required
                      className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization" className="text-slate-700">
                      Organization
                    </Label>
                    <select
                      id="organization"
                      value={newSuperAdmin.organizationId}
                      onChange={(e) => {
                        console.log("Organization selected:", e.target.value) // Debug log
                        setNewSuperAdmin((prev) => ({
                          ...prev,
                          organizationId: e.target.value,
                        }))
                      }}
                      className="w-full p-2 border border-slate-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                      required
                    >
                      <option value="">Select Organization</option>
                      {organizations.map((org) => (
                        <option
                          key={org._id || org.id}
                          value={org._id || org.id}
                        >
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-slate-700">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={newSuperAdmin.location}
                      onChange={(e) =>
                        setNewSuperAdmin({
                          ...newSuperAdmin,
                          location: e.target.value,
                        })
                      }
                      required
                      className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={creatingSA}
                  >
                    {creatingSA ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Super Admin"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isOrgDialogOpen} onOpenChange={setIsOrgDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Building2 className="h-4 w-4 mr-2" />
                  Create Organization
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-slate-50">
                <DialogHeader>
                  <DialogTitle className="text-slate-900">
                    Create Organization
                  </DialogTitle>
                  <DialogDescription className="text-slate-600">
                    Add a new organization to the system
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateOrganization} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName" className="text-slate-700">
                      Organization Name
                    </Label>
                    <Input
                      id="orgName"
                      value={newOrganization.name}
                      onChange={(e) =>
                        setNewOrganization({
                          ...newOrganization,
                          name: e.target.value,
                        })
                      }
                      required
                      className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgLocation" className="text-slate-700">
                      Location
                    </Label>
                    <Input
                      id="orgLocation"
                      value={newOrganization.location}
                      onChange={(e) =>
                        setNewOrganization({
                          ...newOrganization,
                          location: e.target.value,
                        })
                      }
                      required
                      className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgDesc" className="text-slate-700">
                      Description
                    </Label>
                    <textarea
                      id="orgDesc"
                      rows="3"
                      value={newOrganization.description}
                      onChange={(e) =>
                        setNewOrganization({
                          ...newOrganization,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded-md focus:ring-emerald-500 focus:border-emerald-200 bg-white"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={creatingOrg}
                  >
                    {creatingOrg ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Organization"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search organizations or super admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-slate-50 border-slate-200"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="organizations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100">
            <TabsTrigger
              value="organizations"
              className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=inactive]:text-slate-600"
            >
              Organizations
            </TabsTrigger>
            <TabsTrigger
              value="super-admins"
              className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=inactive]:text-slate-600"
            >
              Super Admins
            </TabsTrigger>
          </TabsList>

          <TabsContent value="organizations" className="space-y-6">
            {filteredOrganizations.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-lg font-medium">No organizations</h3>
                <p className="mt-1 text-slate-500">
                  Get started by creating a new organization.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredOrganizations.map((org) => (
                  <Card
                    key={org._id || org.id}
                    className="hover:shadow-md transition-shadow bg-slate-50 border-slate-200"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <Building2 className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {org.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {org.description}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            org.status === "Active" ? "default" : "secondary"
                          }
                          className="bg-emerald-100 text-emerald-700 border-emerald-200"
                        >
                          {org.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{org.memberCount} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{org.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>Created: {org.createdAt}</span>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="super-admins" className="space-y-6">
            {filteredSuperAdmins.length === 0 ? (
              <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-lg font-medium">No super admins</h3>
                <p className="mt-1 text-slate-500">
                  Get started by creating a new super admin.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredSuperAdmins.map((sa) => (
                  <Card
                    key={sa._id || sa.id}
                    className="hover:shadow-md transition-shadow bg-slate-50 border-slate-200"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <User className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {sa.firstName} {sa.lastName}
                            </h3>
                            <p className="text-sm text-slate-500">{sa.email}</p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            sa.status === "Active" ? "default" : "secondary"
                          }
                          className="bg-emerald-100 text-emerald-700 border-emerald-200"
                        >
                          {sa.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Building2 className="h-4 w-4" />
                            <span>{sa.organization}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Joined: {sa.joinDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>Last login: {sa.lastLogin}</span>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleResendCredentials(sa._id || sa.id, sa.email)
                            }
                            disabled={resendingCredentials[sa._id || sa.id]}
                          >
                            {resendingCredentials[sa._id || sa.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}

export default OrganizationsPage
