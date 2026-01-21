import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const EmployeeDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Employee Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View and update your profile information</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0 days</p>
            <p className="text-sm text-muted-foreground">Available leave</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No recent activities</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EmployeeDashboard
