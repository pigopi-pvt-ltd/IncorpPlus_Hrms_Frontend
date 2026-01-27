import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { ROLES } from "../../constants/roles"

const ProtectedRoute = ({ children, allowedRoles = [ROLES.EMPLOYEE] }) => {
  const { isAuthenticated, isLoading, canAccessRoute } = useAuth()
  const location = useLocation()

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access
  if (!canAccessRoute(allowedRoles)) {
    console.log("User cannot access route", {
      allowedRoles,
      userRole: state.role,
      isAuthenticated: state.isAuthenticated,
    })
    // Redirect to appropriate dashboard based on user role
    const redirectTo = getDashboardRedirect()
    return <Navigate to={redirectTo} replace />
  }

  return children
}

// Helper function to get dashboard redirect based on role
const getDashboardRedirect = () => {
  const userData = localStorage.getItem("hrms_user")
  console.log("User data from localStorage:", userData)
  if (userData) {
    try {
      const user = JSON.parse(userData)
      console.log("Parsed user role:", user.role)
      console.log("ROLES.HR:", ROLES.HR)
      switch (user.role) {
        case ROLES.GLOBAL_ADMIN:
          return "/admin/dashboard"
        case ROLES.SUPER_ADMIN:
          return "/super-admin/dashboard"
        case ROLES.HR:
          console.log("Redirecting to HR dashboard")
          return "/hr/dashboard"
        case ROLES.EMPLOYEE:
          return "/employee/dashboard"
        default:
          console.log("Unknown role, redirecting to login")
          return "/login"
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      return "/login"
    }
  }
  return "/login"
}

export default ProtectedRoute
