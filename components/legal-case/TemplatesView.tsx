import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

export function TemplatesView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Document Templates</h2>
        <p className="text-muted-foreground">Create and manage legal document templates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Library</CardTitle>
          <CardDescription>Browse and manage document templates</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Templates view functionality will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
