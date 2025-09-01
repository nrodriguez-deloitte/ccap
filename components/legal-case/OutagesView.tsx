import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

export function OutagesView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Outages</h2>
        <p className="text-muted-foreground">Monitor and track system outages and service disruptions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outages Overview</CardTitle>
          <CardDescription>Current system status and outage information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">Outages view functionality will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  )
}
