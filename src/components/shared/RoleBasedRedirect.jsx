import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { ROLES } from "../../constants/roles"

const RoleBasedRedirect = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user.role) {
      let redirectPath = "/dashboard" // default fallback

      switch (user.role) {
        case ROLES.SUPER_ADMIN:
          redirectPath = "/super-admin/dashboard"
          break
        case ROLES.GLOBAL_ADMIN:
          redirectPath = "/admin/dashboard"
          break
        case ROLES.HR:
          redirectPath = "/hr/dashboard"
          break
        case ROLES.EMPLOYEE:
          redirectPath = "/employee/dashboard"
          break
        default:
          redirectPath = "/dashboard"
      }

      navigate(redirectPath, { replace: true })
    } else {
      // If no user data, redirect to login
      navigate("/login", { replace: true })
    }
  }, [user, navigate])

  return null // This component doesn't render anything
}

export default RoleBasedRedirect
