import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AlertTriangle, CheckCircle, Clock, User, MessageSquare, Flag, ArrowUp } from "lucide-react";
import { Progress } from "./ui/progress";

interface ApprovalItem {
  id: string;
  title: string;
  type: string;
  submittedBy: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected" | "escalated";
  riskLevel: "low" | "medium" | "high" | "critical";
  riskFlags: string[];
  deadline: string;
  reviewer?: string;
  progress: number;
}

interface RiskFlag {
  type: "compliance" | "legal" | "financial" | "regulatory";
  message: string;
  severity: "low" | "medium" | "high" | "critical";
}

const mockApprovals: ApprovalItem[] = [
  {
    id: "APR-001",
    title: "Employment Contract - Senior Developer",
    type: "Contract",
    submittedBy: "Sarah Chen",
    submittedDate: "2025-08-25",
    status: "pending",
    riskLevel: "medium",
    riskFlags: ["Non-standard termination clause", "Above market salary band"],
    deadline: "2025-08-30",
    reviewer: "Michael Torres",
    progress: 60
  },
  {
    id: "APR-002",
    title: "Data Processing Agreement - EU Client",
    type: "GDPR Compliance",
    submittedBy: "Lisa Wang",
    submittedDate: "2025-08-24",
    status: "escalated",
    riskLevel: "high",
    riskFlags: ["Cross-border data transfer", "Inadequate data retention policy"],
    deadline: "2025-08-29",
    progress: 85
  },
  {
    id: "APR-003",
    title: "Partnership Agreement Amendment",
    type: "Contract Amendment",
    submittedBy: "James Miller",
    submittedDate: "2025-08-26",
    status: "approved",
    riskLevel: "low",
    riskFlags: [],
    deadline: "2025-09-02",
    reviewer: "Sarah Chen",
    progress: 100
  }
];

const mockRiskFlags: RiskFlag[] = [
  {
    type: "compliance",
    message: "Document contains non-standard termination clauses that may not comply with local employment law",
    severity: "medium"
  },
  {
    type: "financial",
    message: "Proposed salary exceeds approved budget band by 15%",
    severity: "medium"
  },
  {
    type: "regulatory",
    message: "Cross-border data transfer provisions require additional GDPR safeguards",
    severity: "high"
  }
];

export function ApprovalsSystem() {
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [comments, setComments] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "escalated": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      case "critical": return "bg-red-200 text-red-900";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      case "critical": return "text-red-800";
      default: return "text-gray-600";
    }
  };

  const handleApprove = () => {
    if (selectedApproval) {
      // In a real app, this would make an API call
      console.log("Approving:", selectedApproval.id);
    }
  };

  const handleReject = () => {
    if (selectedApproval) {
      // In a real app, this would make an API call
      console.log("Rejecting:", selectedApproval.id);
    }
  };

  const handleEscalate = () => {
    if (selectedApproval) {
      // In a real app, this would make an API call
      console.log("Escalating:", selectedApproval.id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Approvals Co-Pilot</h1>
        <p className="text-muted-foreground">
          AI-powered review system with risk detection and human-in-the-loop escalation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approval Queue */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="mb-4">Pending Approvals</h2>
            <div className="space-y-3">
              {mockApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedApproval?.id === approval.id ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedApproval(approval)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{approval.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {approval.type} • {approval.submittedBy}
                      </p>
                    </div>
                    <Badge className={getRiskColor(approval.riskLevel)}>
                      {approval.riskLevel}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getStatusColor(approval.status)}>
                      {approval.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Due: {approval.deadline}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Review Progress</span>
                      <span>{approval.progress}%</span>
                    </div>
                    <Progress value={approval.progress} className="h-1" />
                  </div>

                  {approval.riskFlags.length > 0 && (
                    <div className="mt-2 flex items-center text-xs text-red-600">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {approval.riskFlags.length} risk flag{approval.riskFlags.length > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-2">
          {selectedApproval ? (
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2>{selectedApproval.title}</h2>
                    <p className="text-muted-foreground">
                      {selectedApproval.type} • Submitted by {selectedApproval.submittedBy} on {selectedApproval.submittedDate}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(selectedApproval.status)}>
                      {selectedApproval.status}
                    </Badge>
                    <Badge className={getRiskColor(selectedApproval.riskLevel)}>
                      {selectedApproval.riskLevel} risk
                    </Badge>
                  </div>
                </div>

                {/* Risk Analysis */}
                {selectedApproval.riskFlags.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      <h3 className="font-medium text-red-800">Risk Flags Detected</h3>
                    </div>
                    <div className="space-y-2">
                      {mockRiskFlags.map((flag, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Flag className={`h-4 w-4 mt-0.5 ${getSeverityColor(flag.severity)}`} />
                          <div className="flex-1">
                            <p className="text-sm text-red-800">{flag.message}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {flag.type} • {flag.severity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Document Preview */}
                <div className="mb-6">
                  <h3 className="mb-2">Document Preview</h3>
                  <div className="p-4 bg-gray-50 rounded-lg min-h-[200px]">
                    <p className="text-sm text-gray-600 italic">
                      Document content would be displayed here with highlighting for flagged sections...
                    </p>
                  </div>
                </div>

                {/* Comments */}
                <div className="mb-6">
                  <h3 className="mb-2">Review Comments</h3>
                  <Textarea
                    placeholder="Add your review comments, feedback, or questions..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Deadline: {selectedApproval.deadline}</span>
                    {selectedApproval.reviewer && (
                      <>
                        <span>•</span>
                        <User className="h-4 w-4" />
                        <span>Reviewer: {selectedApproval.reviewer}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleEscalate}
                      disabled={selectedApproval.status === "escalated"}
                    >
                      <ArrowUp className="h-4 w-4 mr-2" />
                      Escalate
                    </Button>
                    <Button variant="outline" onClick={handleReject}>
                      Reject
                    </Button>
                    <Button onClick={handleApprove}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </div>
              </Card>

              {/* AI Recommendations */}
              <Card className="p-6">
                <h3 className="mb-4">AI Recommendations</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800">
                          Consider adding standard termination clause language from Template-007 to reduce risk
                        </p>
                        <p className="text-xs text-blue-600 mt-1">Confidence: 92%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-800">
                          Salary amount requires CFO approval as per Policy-Finance-001
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">Confidence: 87%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Select an approval from the queue to begin review
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}