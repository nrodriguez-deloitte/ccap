import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Avatar } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  Calendar, 
  ArrowRight,
  PlayCircle,
  PauseCircle,
  Settings,
  Plus
} from "lucide-react";

interface WorkflowStage {
  id: string;
  name: string;
  status: "completed" | "active" | "pending" | "blocked";
  owner: string;
  sla: number; // hours
  timeSpent: number; // hours
  dueDate: string;
  completedDate?: string;
  gatekeepers: string[];
  requirements: string[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  type: string;
  stages: WorkflowStage[];
  totalSLA: number;
  usage: number;
}

const mockWorkflows: WorkflowTemplate[] = [
  {
    id: "WF-001",
    name: "Employment Contract Review",
    type: "Contract",
    totalSLA: 72,
    usage: 24,
    stages: [
      {
        id: "stage-1",
        name: "Initial Draft",
        status: "completed",
        owner: "Sarah Chen",
        sla: 24,
        timeSpent: 18,
        dueDate: "2025-08-27",
        completedDate: "2025-08-26",
        gatekeepers: ["Legal Team"],
        requirements: ["Template selection", "Client requirements review"]
      },
      {
        id: "stage-2", 
        name: "Legal Review",
        status: "active",
        owner: "Michael Torres",
        sla: 24,
        timeSpent: 12,
        dueDate: "2025-08-29",
        gatekeepers: ["Senior Legal Counsel"],
        requirements: ["Compliance check", "Risk assessment"]
      },
      {
        id: "stage-3",
        name: "Client Approval", 
        status: "pending",
        owner: "Lisa Wang",
        sla: 12,
        timeSpent: 0,
        dueDate: "2025-08-30",
        gatekeepers: ["Client", "Account Manager"],
        requirements: ["Client review", "Final amendments"]
      },
      {
        id: "stage-4",
        name: "Final Execution",
        status: "pending",
        owner: "James Miller",
        sla: 12,
        timeSpent: 0,
        dueDate: "2025-08-31",
        gatekeepers: ["Authorized Signatory"],
        requirements: ["Digital signatures", "Document archival"]
      }
    ]
  }
];

interface ActiveWorkflow {
  id: string;
  title: string;
  template: string;
  currentStage: string;
  progress: number;
  owner: string;
  priority: "high" | "medium" | "low";
  slaStatus: "ontime" | "atrisk" | "overdue";
  dueDate: string;
}

const mockActiveWorkflows: ActiveWorkflow[] = [
  {
    id: "ACT-001",
    title: "Senior Developer Contract - TechCorp",
    template: "Employment Contract Review",
    currentStage: "Legal Review",
    progress: 50,
    owner: "Michael Torres",
    priority: "high",
    slaStatus: "ontime",
    dueDate: "2025-08-31"
  },
  {
    id: "ACT-002",
    title: "GDPR Assessment - EU Client",
    template: "Compliance Review",
    currentStage: "Risk Assessment",
    progress: 75,
    owner: "Sarah Chen",
    priority: "high",
    slaStatus: "atrisk",
    dueDate: "2025-08-30"
  },
  {
    id: "ACT-003",
    title: "Partnership Agreement - StartupXYZ",
    template: "Contract Negotiation",
    currentStage: "Initial Draft",
    progress: 25,
    owner: "Lisa Wang",
    priority: "medium",
    slaStatus: "ontime",
    dueDate: "2025-09-05"
  }
];

export function WorkflowManagement() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate>(mockWorkflows[0]);
  const [activeTab, setActiveTab] = useState("active");

  const getStageStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "active": return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending": return "bg-gray-100 text-gray-600 border-gray-200";
      case "blocked": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getSLAStatusColor = (status: string) => {
    switch (status) {
      case "ontime": return "bg-green-100 text-green-800";
      case "atrisk": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
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

  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "active": return <PlayCircle className="h-5 w-5 text-blue-600" />;
      case "pending": return <Clock className="h-5 w-5 text-gray-400" />;
      case "blocked": return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Template Management</h1>
        <p className="text-muted-foreground">
          Define workflows, track progress, and manage templates from initiation to completion
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2>Active Workflows</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Start New Workflow
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {mockActiveWorkflows.map((workflow) => (
              <Card key={workflow.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{workflow.title}</h3>
                      <p className="text-sm text-muted-foreground">{workflow.template}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getPriorityColor(workflow.priority)}>
                        {workflow.priority}
                      </Badge>
                      <Badge className={getSLAStatusColor(workflow.slaStatus)}>
                        {workflow.slaStatus === "ontime" ? "On Time" : 
                         workflow.slaStatus === "atrisk" ? "At Risk" : "Overdue"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{workflow.progress}%</span>
                    </div>
                    <Progress value={workflow.progress} className="w-full" />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Current Stage:</span>
                      <span className="font-medium">{workflow.currentStage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Owner:</span>
                      <span>{workflow.owner}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Due:</span>
                      <span>{workflow.dueDate}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Update Status
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template List */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2>Workflow Templates</h2>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </div>
                <div className="space-y-2">
                  {mockWorkflows.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedWorkflow?.id === template.id ? "border-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedWorkflow(template)}
                    >
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <p className="text-xs text-muted-foreground">{template.type}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {template.stages.length} stages
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Used {template.usage} times
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Template Details */}
            <div className="lg:col-span-2">
              {selectedWorkflow && (
                <div className="space-y-4">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2>{selectedWorkflow.name}</h2>
                        <p className="text-muted-foreground">
                          {selectedWorkflow.type} • {selectedWorkflow.totalSLA}h SLA
                        </p>
                      </div>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Template
                      </Button>
                    </div>

                    {/* Workflow Stages */}
                    <div className="space-y-4">
                      <h3>Workflow Stages</h3>
                      {selectedWorkflow.stages.map((stage, index) => (
                        <Card key={stage.id} className={`p-4 border-2 ${getStageStatusColor(stage.status)}`}>
                          <div className="flex items-start space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-500">
                                {index + 1}
                              </span>
                              {getStageIcon(stage.status)}
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{stage.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Owner: {stage.owner} • SLA: {stage.sla}h
                                  </p>
                                </div>
                                <div className="text-right text-sm">
                                  <div className="text-muted-foreground">Due: {stage.dueDate}</div>
                                  {stage.completedDate && (
                                    <div className="text-green-600">
                                      Completed: {stage.completedDate}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Time Progress */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Time Progress</span>
                                  <span>{stage.timeSpent}h / {stage.sla}h</span>
                                </div>
                                <Progress 
                                  value={(stage.timeSpent / stage.sla) * 100} 
                                  className="h-2" 
                                />
                              </div>

                              {/* Gatekeepers */}
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium">Gatekeepers</h5>
                                <div className="flex flex-wrap gap-2">
                                  {stage.gatekeepers.map((gatekeeper, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      <User className="h-3 w-3 mr-1" />
                                      {gatekeeper}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Requirements */}
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium">Requirements</h5>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {stage.requirements.map((req, i) => (
                                    <li key={i} className="flex items-center">
                                      <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                                      {req}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <PlayCircle className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Workflows</p>
                  <p className="text-2xl">{mockActiveWorkflows.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Completion Time</p>
                  <p className="text-2xl">48h</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">SLA Compliance</p>
                  <p className="text-2xl">94%</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Bottlenecks</p>
                  <p className="text-2xl">2</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4">Workflow Performance</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Workflow analytics chart would be displayed here</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
