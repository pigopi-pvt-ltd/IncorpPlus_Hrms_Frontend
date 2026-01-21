import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const UsersManagementPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No users found.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default UsersManagementPage
