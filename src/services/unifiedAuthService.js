import axios from "axios"
import { STORAGE_KEYS } from "../constants/roles"

// Real API client
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add interceptors
// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

class UnifiedAuthService {
  // Login method
  async login(credentials) {
    try {
      // Support login with email, mobile number, or username as identifier
      const loginPayload = {
        identifier:
          credentials.identifier ||
          credentials.email ||
          credentials.username ||
          credentials.mobile,
        password: credentials.password,
      }
      const response = await apiClient.post("/api/auth/login", loginPayload)

      // Ensure the response has the expected format
      const responseData = response.data

      // Store token and user in localStorage
      if (responseData.token && responseData.user) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, responseData.token)
        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(responseData.user)
        )
      }

      return responseData
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  // Register method
  async register(userData) {
    try {
      const response = await apiClient.post("/api/auth/register", userData)
      return response.data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiClient.get("/api/auth/me")
      return response.data
    } catch (error) {
      console.error("Get current user error:", error)
      throw error
    }
  }

  // Logout
  async logout() {
    try {
      await apiClient.post("/api/auth/logout")
      // Clear local storage on successful logout
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    } catch (error) {
      console.error("Logout error:", error)
      // Still clear local storage even if API call fails
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      throw error
    }
  }

  // Register HR (Super Admin only)
  async registerHR(hrData) {
    try {
      const response = await apiClient.post("/api/auth/register/hr", hrData)
      return response.data
    } catch (error) {
      console.error("Register HR error:", error)
      throw error
    }
  }

  // Register Employee (HR only)
  async registerEmployee(employeeData) {
    try {
      const response = await apiClient.post(
        "/api/auth/register/employee",
        employeeData
      )
      return response.data
    } catch (error) {
      console.error("Register employee error:", error)
      throw error
    }
  }

  // Create Organization (Global Admin only)
  async createOrganization(organizationData) {
    try {
      const response = await apiClient.post(
        "/api/auth/organization",
        organizationData
      )
      return response.data
    } catch (error) {
      console.error("Create organization error:", error)
      throw error
    }
  }

  // Get All Organizations (Global Admin only)
  async getAllOrganizations() {
    try {
      const response = await apiClient.get("/api/auth/organizations")
      return response.data
    } catch (error) {
      console.error("Get organizations error:", error)
      throw error
    }
  }

  // Get All Super Admins (Global Admin and Super Admin only)
  async getAllSuperAdmins() {
    try {
      const response = await apiClient.get("/api/auth/super-admins")
      return response.data
    } catch (error) {
      console.error("Get super admins error:", error)
      throw error
    }
  }

  // Register Super Admin (Global Admin only)
  async registerSuperAdmin(superAdminData) {
    try {
      // For registering a super admin, we'd typically use the register endpoint
      // but with specific role assignment - using register HR endpoint as per API spec
      const response = await apiClient.post("/api/auth/register/hr", {
        ...superAdminData,
        role: "Super_Admin", // Override role to Super_Admin
      })
      return response.data
    } catch (error) {
      console.error("Register super admin error:", error)
      throw error
    }
  }

  // Resend Super Admin Credentials (Global_Admin and Super_Admin only)
  async resendCredentials(userId) {
    try {
      const response = await apiClient.post("/api/auth/resend-credentials", {
        userId,
      })
      return response.data
    } catch (error) {
      console.error("Resend credentials error:", error)
      throw error
    }
  }
}

export default new UnifiedAuthService()
