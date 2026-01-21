import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const EmployeeProfilePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your profile details will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default EmployeeProfilePage
