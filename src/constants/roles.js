// RBAC Roles Constants
export const ROLES = {
  GLOBAL_ADMIN: "Global_Admin",
  SUPER_ADMIN: "Super_Admin",
  HR: "HR",
  EMPLOYEE: "Employee",
}

// Role Levels (higher number = higher privilege)
export const ROLE_LEVELS = {
  [ROLES.GLOBAL_ADMIN]: 4,
  [ROLES.SUPER_ADMIN]: 3,
  [ROLES.HR]: 2,
  [ROLES.EMPLOYEE]: 1,
}

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/auth/me",
    LOGOUT: "/api/auth/logout",
  },
  USERS: {
    ROLE: "/api/auth/role",
    ORGANIZATION: "/api/auth/organization",
    REGISTER_HR: "/api/auth/register/hr",
    REGISTER_EMPLOYEE: "/api/auth/register/employee",
  },
}

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "hrms_token",
  USER: "hrms_user",
  REFRESH_TOKEN: "hrms_refresh_token",
}
