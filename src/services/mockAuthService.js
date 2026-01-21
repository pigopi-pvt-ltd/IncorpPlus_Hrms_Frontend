// Mock authentication service for frontend testing
// This simulates API responses without requiring a backend

const MOCK_USERS = {
  "admin@company.com": {
    email: "admin@company.com",
    username: "admin",
    mobile: "+1234567890",
    password: "password123",
    firstName: "Global",
    lastName: "Admin",
    role: "Global_Admin",
    organizationId: "org-1",
    location: "Headquarters",
    department: "Administration",
    id: "user-1",
  },
  "hr@company.com": {
    email: "hr@company.com",
    username: "hr_manager",
    mobile: "+1234567891",
    password: "password123",
    firstName: "HR",
    lastName: "Manager",
    role: "HR",
    organizationId: "org-1",
    location: "Headquarters",
    department: "HR",
    id: "user-2",
  },
  "employee@company.com": {
    email: "employee@company.com",
    username: "john_employee",
    mobile: "+1234567892",
    password: "password123",
    firstName: "John",
    lastName: "Employee",
    role: "Employee",
    organizationId: "org-1",
    location: "Headquarters",
    department: "Engineering",
    id: "user-3",
  },
  "superadmin@system.com": {
    email: "superadmin@system.com",
    username: "super_admin",
    mobile: "+1234567893",
    password: "password123",
    firstName: "Super",
    lastName: "Admin",
    role: "Super_Admin",
    organizationId: "org-1",
    location: "Headquarters",
    department: "Management",
    id: "user-4",
  },
}

class MockAuthService {
  // Simulate login with identifier (email, username, or mobile)
  async login(credentials) {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        const { identifier, password, email, username, mobile } = credentials

        // Determine the actual identifier to use
        const actualIdentifier = identifier || email || username || mobile

        if (!actualIdentifier) {
          reject(new Error("Identifier is required"))
          return
        }

        // Helper function to normalize phone numbers by removing common separators
        const normalizePhone = (phone) => {
          if (!phone) return ""
          return phone.toString().replace(/[^\d+]/g, "") // Keep only digits and +
        }

        // Find user by email, username, or mobile
        let user = null
        for (const userEmail in MOCK_USERS) {
          const currentUser = MOCK_USERS[userEmail]

          const normalizedActualIdentifier = normalizePhone(actualIdentifier)
          const normalizedMobile = normalizePhone(currentUser.mobile)

          if (
            currentUser.email === actualIdentifier ||
            currentUser.username === actualIdentifier ||
            currentUser.mobile === actualIdentifier ||
            normalizedMobile === normalizedActualIdentifier
          ) {
            user = currentUser
            break
          }
        }

        if (!user) {
          reject(new Error("User not found"))
          return
        }

        if (user.password !== password) {
          reject(new Error("Invalid password"))
          return
        }

        // Generate mock token
        const token = `mock-jwt-token-${user.id}-${Date.now()}`

        // Return successful response matching API spec
        resolve({
          success: true,
          message: "Login successful",
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
            countryCode: "+1",
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            organizationId: user.organizationId,
            location: user.location,
            department: user.department,
            designation: user.designation || "Staff",
            isActive: true,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
        })
      }, 800) // 800ms delay to simulate real API
    })
  }

  // Mock register function
  async register(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          ...userData,
          id: `user-${Date.now()}`,
          role: userData.role || "Employee",
          isActive: true,
          createdAt: new Date().toISOString(),
        }

        resolve({
          success: true,
          message: "User registered successfully",
          user: newUser,
          token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
        })
      }, 1000)
    })
  }

  // Mock get current user
  async getCurrentUser() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: "user-1",
            username: "admin",
            email: "admin@company.com",
            mobile: "+1234567890",
            countryCode: "+1",
            firstName: "Global",
            lastName: "Admin",
            role: "Global_Admin",
            organizationId: "org-1",
            location: "Headquarters",
            department: "Administration",
            designation: "Administrator",
            dateOfJoining: "2023-01-15",
            isActive: true,
            lastLoginAt: new Date().toISOString(),
            profilePicture: null,
            emergencyContact: {
              name: "Emergency Contact",
              relationship: "Spouse",
              phone: "+1234567899",
            },
            address: {
              street: "123 Main St",
              city: "City",
              state: "State",
              country: "Country",
              zipCode: "12345",
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        })
      }, 500)
    })
  }

  // Mock logout
  async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "Logged out successfully" })
      }, 300)
    })
  }
}

export default new MockAuthService()
