import { useState } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"

const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - passing the setter function to update its state */}
      <Sidebar onCollapseChange={setSidebarCollapsed} />

      {/* Mobile sidebar overlay */}
      {sidebarCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarCollapsed(false)}
        />
      )}

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
