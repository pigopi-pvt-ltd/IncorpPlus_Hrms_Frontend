import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const EmployeeManagementPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Employee Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No employees found.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default EmployeeManagementPage
