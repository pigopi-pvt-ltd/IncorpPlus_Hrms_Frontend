import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const HRDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">HR Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Leave requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payroll Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Up to date</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Hires</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HRDashboard
