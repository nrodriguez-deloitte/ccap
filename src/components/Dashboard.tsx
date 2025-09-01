import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { AlertTriangle, Clock, CheckCircle, Users, FileText, TrendingUp } from "lucide-react";

interface CaseItem {
  id: string;
  title: string;
  type: string;
  status: "draft" | "review" | "approved" | "published" | "blocked";
  priority: "high" | "medium" | "low";
  assignee: string;
  dueDate: string;
  progress: number;
}

const mockCases: CaseItem[] = [
  {
    id: "CASE-001",
    title: "Employment Contract Review - Tech Startup",
    type: "Contract Review",
    status: "review",
    priority: "high",
    assignee: "Sarah Chen",
    dueDate: "2025-09-02",
    progress: 75
  },
  {
    id: "CASE-002", 
    title: "GDPR Compliance Assessment",
    type: "Compliance",
    status: "blocked",
    priority: "high",
    assignee: "Michael Torres",
    dueDate: "2025-08-30",
    progress: 45
  },
  {
    id: "CASE-003",
    title: "Partnership Agreement Draft",
    type: "Contract Draft",
    status: "draft",
    priority: "medium",
    assignee: "Lisa Wang",
    dueDate: "2025-09-05",
    progress: 30
  },
  {
    id: "CASE-004",
    title: "Policy Update - Remote Work",
    type: "Policy",
    status: "approved",
    priority: "low",
    assignee: "James Miller",
    dueDate: "2025-08-28",
    progress: 100
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft": return "bg-gray-100 text-gray-800";
    case "review": return "bg-blue-100 text-blue-800";
    case "approved": return "bg-green-100 text-green-800";
    case "published": return "bg-purple-100 text-purple-800";
    case "blocked": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-800";
    case "medium": return "bg-yellow-100 text-yellow-800";
    case "low": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export function Dashboard() {
  const totalCases = mockCases.length;
  const activeCases = mockCases.filter(c => c.status !== "published").length;
  const blockedCases = mockCases.filter(c => c.status === "blocked").length;
  const overdueCount = 1; // Mock data

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>UniView Dashboard</h1>
        <p className="text-muted-foreground">
          Bird's eye view of your work - active cases, approvals, and workflow status
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Cases</p>
              <p className="text-2xl">{totalCases}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Active Cases</p>
              <p className="text-2xl">{activeCases}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Blocked Cases</p>
              <p className="text-2xl">{blockedCases}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl">{overdueCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Cases Table */}
      <Card className="p-6">
        <h2 className="mb-4">Active Cases</h2>
        <div className="space-y-4">
          {mockCases.map((caseItem) => (
            <div key={caseItem.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{caseItem.id}</span>
                  <Badge className={getStatusColor(caseItem.status)}>
                    {caseItem.status}
                  </Badge>
                  <Badge className={getPriorityColor(caseItem.priority)} variant="outline">
                    {caseItem.priority}
                  </Badge>
                </div>
                <h3 className="font-medium">{caseItem.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{caseItem.type}</span>
                  <span>•</span>
                  <span>Assigned to {caseItem.assignee}</span>
                  <span>•</span>
                  <span>Due {caseItem.dueDate}</span>
                </div>
              </div>
              <div className="w-32 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{caseItem.progress}%</span>
                </div>
                <Progress value={caseItem.progress} className="w-full" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}