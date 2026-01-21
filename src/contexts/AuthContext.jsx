import { createContext, useContext, useEffect, useReducer } from "react"
import { STORAGE_KEYS, ROLES, ROLE_LEVELS } from "../constants/roles"

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  role: null,
  organization: null,
}

// Action types
const ACTIONS = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
  UPDATE_USER: "UPDATE_USER",
}

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        role: action.payload.user?.role,
        organization: action.payload.user?.organizationId,
      }
    case ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
        organization: null,
      }
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }
    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: action.payload,
        role: action.payload?.role,
        organization: action.payload?.organizationId,
      }
    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
        const userData = localStorage.getItem(STORAGE_KEYS.USER)

        if (token && userData) {
          const user = JSON.parse(userData)
          dispatch({
            type: ACTIONS.LOGIN,
            payload: { user, token },
          })
        } else {
          dispatch({ type: ACTIONS.SET_LOADING, payload: false })
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        logout()
      }
    }

    initializeAuth()
  }, [])

  // Login function - Updated to handle response properly
  const login = async (credentials) => {
    // Import the unifiedAuthService here to avoid circular dependencies
    const unifiedAuthService = (await import("../services/unifiedAuthService"))
      .default

    // Call the actual login method from unifiedAuthService
    const response = await unifiedAuthService.login(credentials)

    // Handle response from API - could be direct object or need to extract from response
    const loginData = response.success !== undefined ? response : response

    const userData = loginData.user || loginData
    const token = loginData.token || response.token

    if (token && userData) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))

      dispatch({
        type: ACTIONS.LOGIN,
        payload: { user: userData, token },
      })

      return { success: true, user: userData, token }
    } else {
      throw new Error("Invalid login response format")
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)

    dispatch({ type: ACTIONS.LOGOUT })
  }

  // Update user data
  const updateUser = (userData) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
    dispatch({
      type: ACTIONS.UPDATE_USER,
      payload: userData,
    })
  }

  // RBAC helper functions
  const hasRole = (requiredRole) => {
    if (!state.role) return false
    return ROLE_LEVELS[state.role] >= ROLE_LEVELS[requiredRole]
  }

  const hasAnyRole = (roles) => {
    return roles.some((role) => hasRole(role))
  }

  const isGlobalAdmin = () => hasRole(ROLES.GLOBAL_ADMIN)
  const isSuperAdmin = () => hasRole(ROLES.SUPER_ADMIN)
  const isHR = () => hasRole(ROLES.HR)
  const isEmployee = () => hasRole(ROLES.EMPLOYEE)

  const canAccessRoute = (allowedRoles) => {
    if (!state.isAuthenticated) return false
    return hasAnyRole(allowedRoles)
  }

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
    isGlobalAdmin,
    isSuperAdmin,
    isHR,
    isEmployee,
    canAccessRoute,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthContext
