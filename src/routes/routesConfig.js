import { lazy } from "react"
import { ROLES } from "../constants/roles"

// Lazy load page components
const LoginPage = lazy(() => import("../pages/auth/LoginPage"))
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"))

// Admin Pages
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"))
const OrganizationsPage = lazy(() => import("../pages/admin/OrganizationsPage"))
const UsersManagementPage = lazy(() =>
  import("../pages/admin/UsersManagementPage")
)

// Super Admin Pages
const SuperAdminDashboard = lazy(() =>
  import("../pages/admin/SuperAdminDashboard")
)
const RegisterHRPage = lazy(() => import("../pages/admin/RegisterHRPage"))
const DocumentRequirementsPage = lazy(() =>
  import("../pages/admin/DocumentRequirementsPage")
)
const MasterDataManagementPage = lazy(() =>
  import("../pages/admin/MasterDataManagementPage")
)

// HR Pages
const HRDashboard = lazy(() => import("../pages/hr/HRDashboard"))
const EmployeeManagementPage = lazy(() =>
  import("../pages/hr/EmployeeManagementPage")
)
const RegisterEmployeePage = lazy(() =>
  import("../pages/hr/RegisterEmployeePage")
)
const PayrollPage = lazy(() => import("../pages/hr/PayrollPage"))
const LeaveRequestsPage = lazy(() => import("../pages/hr/LeaveRequestsPage"))

// Employee Pages
const EmployeeDashboard = lazy(() =>
  import("../pages/employee/EmployeeDashboard")
)
const EmployeeProfilePage = lazy(() =>
  import("../pages/employee/EmployeeProfilePage")
)
const ApplyLeavePage = lazy(() => import("../pages/employee/ApplyLeavePage"))

// Route configuration with RBAC
export const routes = [
  // Public routes
  {
    path: "/login",
    element: LoginPage,
    isPublic: true,
  },
  {
    path: "/register",
    element: null, // Will implement later
    isPublic: true,
  },

  // Protected routes - Dashboard variations
  {
    path: "/dashboard",
    element: DashboardPage,
    allowedRoles: [
      ROLES.EMPLOYEE,
      ROLES.HR,
      ROLES.SUPER_ADMIN,
      ROLES.GLOBAL_ADMIN,
    ],
  },

  // Admin routes
  {
    path: "/admin/dashboard",
    element: AdminDashboard,
    allowedRoles: [ROLES.GLOBAL_ADMIN],
  },
  {
    path: "/admin/organizations",
    element: OrganizationsPage,
    allowedRoles: [ROLES.GLOBAL_ADMIN],
  },
  {
    path: "/admin/users",
    element: UsersManagementPage,
    allowedRoles: [ROLES.GLOBAL_ADMIN],
  },
  {
    path: "/admin/document-requirements",
    element: DocumentRequirementsPage,
    allowedRoles: [ROLES.GLOBAL_ADMIN],
  },

  // Super Admin routes
  {
    path: "/super-admin/dashboard",
    element: SuperAdminDashboard,
    allowedRoles: [ROLES.SUPER_ADMIN],
  },
  {
    path: "/super-admin/register-hr",
    element: RegisterHRPage,
    allowedRoles: [ROLES.SUPER_ADMIN],
  },
  {
    path: "/super-admin/users",
    element: UsersManagementPage,
    allowedRoles: [ROLES.SUPER_ADMIN],
  },
  {
    path: "/super-admin/document-requirements",
    element: DocumentRequirementsPage,
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.GLOBAL_ADMIN],
  },
  {
    path: "/super-admin/master-data",
    element: MasterDataManagementPage,
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.GLOBAL_ADMIN],
  },

  // HR routes
  {
    path: "/hr/dashboard",
    element: HRDashboard,
    allowedRoles: [ROLES.HR],
  },
  {
    path: "/hr/employees",
    element: EmployeeManagementPage,
    allowedRoles: [ROLES.HR],
  },
  {
    path: "/hr/register-employee",
    element: RegisterEmployeePage,
    allowedRoles: [ROLES.HR],
  },
  {
    path: "/hr/payroll",
    element: PayrollPage,
    allowedRoles: [ROLES.HR],
  },
  {
    path: "/hr/leave-requests",
    element: LeaveRequestsPage,
    allowedRoles: [ROLES.HR],
  },

  // Employee routes
  {
    path: "/employee/dashboard",
    element: EmployeeDashboard,
    allowedRoles: [ROLES.EMPLOYEE],
  },
  {
    path: "/employee/profile",
    element: EmployeeProfilePage,
    allowedRoles: [ROLES.EMPLOYEE],
  },
  {
    path: "/employee/apply-leave",
    element: ApplyLeavePage,
    allowedRoles: [ROLES.EMPLOYEE],
  },
]

// Helper function to get routes by role
export const getRoutesByRole = (role) => {
  return routes.filter(
    (route) =>
      route.isPublic ||
      (route.allowedRoles && route.allowedRoles.includes(role))
  )
}

// Helper function to check if route is accessible
export const isRouteAccessible = (pathname, userRole) => {
  const route = routes.find((r) => r.path === pathname)
  if (!route) return false

  if (route.isPublic) return true

  return route.allowedRoles && route.allowedRoles.includes(userRole)
}
