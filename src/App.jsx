import { Suspense } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import ProtectedRoute from "./components/shared/ProtectedRoute"
import { routes } from "./routes/routesConfig"
import { Toaster } from "./components/ui/toast"

// Loading component for lazy-loaded pages
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

// Public route wrapper
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Dynamic route generation */}
          {routes.map((route) => {
            const RouteElement = route.element

            if (!RouteElement) return null

            if (route.isPublic) {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <PublicRoute>
                      <RouteElement />
                    </PublicRoute>
                  }
                />
              )
            }

            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute allowedRoles={route.allowedRoles}>
                    <RouteElement />
                  </ProtectedRoute>
                }
              />
            )
          })}

          {/* Catch-all route - redirect to appropriate dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        {/* Toast Provider */}
        <Toaster position="top-right" richColors />
      </Suspense>
    </Router>
  )
}

export default App
