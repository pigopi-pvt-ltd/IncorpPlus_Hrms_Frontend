import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PayrollPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payroll Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payroll Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Payroll processing system will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default PayrollPage
