import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const LeaveRequestsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Leave Requests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No pending leave requests.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default LeaveRequestsPage
