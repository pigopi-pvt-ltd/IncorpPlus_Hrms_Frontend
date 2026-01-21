import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const SuperAdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total HR Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">
              Registered HR managers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Good</p>
            <p className="text-sm text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
