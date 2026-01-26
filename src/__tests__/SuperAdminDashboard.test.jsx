import React from "react"
import { render, screen } from "@testing-library/react"
import SuperAdminDashboard from "../pages/admin/SuperAdminDashboard"

// Mock the UI components since they're not available in test environment
jest.mock("@/components/ui/card", () => ({
  Card: ({ children, className }) => (
    <div className={className}>{children}</div>
  ),
  CardHeader: ({ children, className }) => (
    <div className={className}>{children}</div>
  ),
  CardTitle: ({ children, className }) => (
    <h3 className={className}>{children}</h3>
  ),
  CardContent: ({ children, className }) => (
    <div className={className}>{children}</div>
  ),
}))

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, variant, size, className }) => (
    <button
      className={`${className} btn-${variant || "default"} btn-${size || "md"}`}
    >
      {children}
    </button>
  ),
}))

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children, variant, className }) => (
    <span className={`${className} badge-${variant || "default"}`}>
      {children}
    </span>
  ),
}))

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, className }) => (
    <div className={className}>{children}</div>
  ),
  AvatarFallback: ({ children, className }) => (
    <span className={className}>{children}</span>
  ),
}))

// Mock Lucide React icons
jest.mock("lucide-react", () => ({
  Users: () => <svg>Users</svg>,
  UserPlus: () => <svg>UserPlus</svg>,
  Building: () => <svg>Building</svg>,
  FileText: () => <svg>FileText</svg>,
  TrendingUp: () => <svg>TrendingUp</svg>,
  TrendingDown: () => <svg>TrendingDown</svg>,
  AlertTriangle: () => <svg>AlertTriangle</svg>,
  CheckCircle: () => <svg>CheckCircle</svg>,
  Clock: () => <svg>Clock</svg>,
  Eye: () => <svg>Eye</svg>,
  MoreHorizontal: () => <svg>MoreHorizontal</svg>,
}))

describe("SuperAdminDashboard", () => {
  test("renders dashboard title", () => {
    render(<SuperAdminDashboard />)
    expect(screen.getByText("Super Admin Dashboard")).toBeInTheDocument()
  })

  test("displays key statistics cards", () => {
    render(<SuperAdminDashboard />)

    // Check if main stat cards are rendered
    expect(screen.getByText("Total HR Managers")).toBeInTheDocument()
    expect(screen.getByText("Pending Registrations")).toBeInTheDocument()
    expect(screen.getByText("Active Organizations")).toBeInTheDocument()
    expect(screen.getByText("Total Employees")).toBeInTheDocument()
  })

  test("shows system status section", () => {
    render(<SuperAdminDashboard />)
    expect(screen.getByText("System Status")).toBeInTheDocument()
  })

  test("displays recent activities section", () => {
    render(<SuperAdminDashboard />)
    expect(screen.getByText("Recent Activities")).toBeInTheDocument()
  })

  test("renders quick actions section", () => {
    render(<SuperAdminDashboard />)
    expect(screen.getByText("Quick Actions")).toBeInTheDocument()
  })
})
