"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { Progress } from "../../ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Textarea } from "../../ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { MessageSquare, Calendar, User, MapPin, CheckCircle, Clock, Mail, History, Copy, Send, Edit3 } from "lucide-react";
import type { WorkItem } from "./WorkItemList";

interface WorkItemDetailProps {
  workItem: WorkItem;
  onCreateComms: () => void;
  onRefineComms: (refinementPrompt: string) => void;
  isGenerating: boolean;
  currentStep: number;
  progress: number;
  onEmailNotification: () => void;
  isCompleted: boolean;
}

const typeDescriptions: Record<string,string> = {
  complaint: "Customer complaint requiring response and resolution communication",
  outage: "Service outage affecting customers, requires status updates and resolution notices",
  bid: "Business proposal requiring stakeholder communication and status updates",
  comms: "Existing communication item that may need follow-up or updates"
};

const priorityDescriptions: Record<string,string> = {
  low: "Standard processing time, routine communication",
  medium: "Moderate urgency, timely communication required",
  high: "High priority, urgent communication needed",
  critical: "Critical issue, immediate communication required"
};

const workflowSteps = [
  { name: "Impact Assessment", description: "Analyzing scope and impact", estimatedTime: "3-4 sec" },
  { name: "Stakeholder Identification", description: "Identifying affected parties", estimatedTime: "2-3 sec" },
  { name: "Template Selection", description: "Choosing appropriate templates", estimatedTime: "1-2 sec" },
  { name: "Content Generation", description: "Creating personalized content", estimatedTime: "4-5 sec" },
  { name: "Approval Workflow", description: "Routing through approval process", estimatedTime: "1-2 sec" },
  { name: "Distribution Setup", description: "Configuring delivery channels", estimatedTime: "2-3 sec" }
];

// Rich audit trail mirroring prototype (durations intentionally align with progress simulation ms mapping ~3.7s etc)
const mockAuditTrail = [
  {
    step: "Impact Assessment",
    reasoning: "Analyzed work item type and priority to determine communication urgency. Identified this as a high-impact scenario affecting business operations during peak hours.",
    decisions: [
      "Classified as high-impact due to business hour disruption",
      "Determined need for both immediate and follow-up communications",
      "Identified potential for customer churn if not handled properly"
    ],
    dataPoints: ["Priority: High", "Type: Complaint", "Location: Downtown Business District", "Peak hours affected"],
    duration: "3.7 seconds"
  },
  {
    step: "Stakeholder Identification",
    reasoning: "Mapped affected parties and prioritized stakeholder groups for multi-channel notification sequencing.",
    decisions: [
      "Primary: Business customers (downtown)",
      "Secondary: Residential customers (transparency)",
      "Internal: Support & Ops leadership",
      "Regulatory: Quality reporting team"
    ],
    dataPoints: ["~247 business customers", "~1,100 total users", "3 enterprise clients"],
    duration: "2.4 seconds"
  },
  {
    step: "Template Selection",
    reasoning: "Selected templates balancing transparency with reassurance and formal tone for business audience.",
    decisions: [
      "Email: Business service disruption base template",
      "SMS: Concise alert variant",
      "Tone: Professional, action-oriented",
      "Include compensation reference"
    ],
    dataPoints: ["Template ID: BSI-001", "Tone Score: 8.2/10", "Readability: Grade 9"],
    duration: "1.2 seconds"
  },
  {
    step: "Content Generation",
    reasoning: "Generated channel-specific content incorporating timelines, mitigation steps and reassurance elements.",
    decisions: [
      "Included 24–48h restoration window",
      "Added backup service activation",
      "Provided proactive contact guidance",
      "Omitted granular technical jargon"
    ],
    dataPoints: ["Email length: 312 words", "SMS length: 128 chars", "Sentiment score: +0.73"],
    duration: "4.8 seconds"
  },
  {
    step: "Approval Workflow",
    reasoning: "Fast-tracked via predefined escalation lane for high-priority operational incidents.",
    decisions: [
      "Auto-approved: criteria matched",
      "Notified Operations Manager",
      "Legal review bypassed (standard template)",
      "Risk score validated"
    ],
    dataPoints: ["Approval time: 23s", "Risk score: 2.1/10", "Escalation lane: Active"],
    duration: "1.6 seconds"
  },
  {
    step: "Distribution Setup",
    reasoning: "Configured multi-channel rollout with staged email follow-up after immediate SMS blast.",
    decisions: [
      "SMS immediate notification",
      "Email 15m delayed",
      "Preference honoring enabled",
      "Engagement analytics activated"
    ],
    dataPoints: ["Channels: 2", "Reach: 98.7%", "Window: 20m"],
    duration: "2.9 seconds"
  }
];

const mockCommHistory = [
  { id: 1, date: "2024-01-10", type: "Email", recipient: "All Customers", subject: "Service Update", status: "Sent" },
  { id: 2, date: "2024-01-08", type: "SMS", recipient: "Affected Area", subject: "Outage Alert", status: "Sent" },
  { id: 3, date: "2024-01-05", type: "Email", recipient: "Business Customers", subject: "Maintenance Notice", status: "Sent" }
];

function buildGeneratedComm(workItem: WorkItem){
  return {
    email: {
      subject: `${workItem.title} – Status Update`,
      body: `Dear Stakeholder,\n\nThis communication concerns: ${workItem.title}.\n\nPriority: ${workItem.priority.toUpperCase()}\nCurrent Status: ${workItem.status}\nType: ${workItem.type}\n${workItem.location ? `Location: ${workItem.location}\n` : ""}Created: ${workItem.createdAt}\n\nSummary:\n${workItem.description}\n\nNext Steps:\n- Ongoing monitoring\n- Additional updates will follow automatically\n\nRegards,\nCommunications Team`
    },
    sms: { body: `${workItem.title} update: status ${workItem.status}. Priority ${workItem.priority}.` }
  };
}

export function WorkItemDetail({ 
  workItem,
  onCreateComms,
  onRefineComms,
  isGenerating,
  currentStep,
  progress,
  onEmailNotification,
  isCompleted
}: WorkItemDetailProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const [showRefinementDialog, setShowRefinementDialog] = useState(false);

  const generated = buildGeneratedComm(workItem);

  return (
    <div className="space-y-6">
  <Card>
        <CardHeader className="p-6 pt-8 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {workItem.title}
                <Badge variant="outline">{workItem.type}</Badge>
              </CardTitle>
              <p className="text-gray-500 mt-2 text-sm">{workItem.description}</p>
            </div>
          </div>
        </CardHeader>
  <CardContent className="space-y-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="flex items-center gap-2 mb-2 text-sm font-semibold"><Calendar className="h-4 w-4" />Timeline</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>Created: {workItem.createdAt}</p>
                  <p>Status: <Badge className="ml-1" variant="outline">{workItem.status}</Badge></p>
                </div>
              </div>
              {workItem.assignee && (
                <div>
                  <h4 className="flex items-center gap-2 mb-2 text-sm font-semibold"><User className="h-4 w-4" />Assignment</h4>
                  <p className="text-xs text-gray-600">Assigned to: {workItem.assignee}</p>
                </div>
              )}
              {workItem.location && (
                <div>
                  <h4 className="flex items-center gap-2 mb-2 text-sm font-semibold"><MapPin className="h-4 w-4" />Location</h4>
                  <p className="text-xs text-gray-600">{workItem.location}</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold">Priority Level</h4>
                <div className="mt-2">
                  <Badge className="mb-2" variant="outline">{workItem.priority}</Badge>
                  <p className="text-xs text-gray-600">{priorityDescriptions[workItem.priority]}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Communication Requirements</h4>
                <p className="text-xs text-gray-600 mt-2">{typeDescriptions[workItem.type]}</p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Communication Options</h4>
            <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3">
              {isCompleted ? (
                <Dialog open={showRefinementDialog} onOpenChange={setShowRefinementDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2"><Edit3 className="h-4 w-4" />Refine Communications</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Refine Communications</DialogTitle>
                      <DialogDescription>Describe what you'd like to change or improve.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea value={refinementPrompt} onChange={e=> setRefinementPrompt(e.target.value)} placeholder="e.g., Make tone more formal, add timeline, include metrics..." className="min-h-[100px]" />
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={()=> setShowRefinementDialog(false)}>Cancel</Button>
                        <Button disabled={!refinementPrompt.trim()} onClick={()=> { onRefineComms(refinementPrompt.trim()); setRefinementPrompt(""); setShowRefinementDialog(false); }}>Apply Refinement</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button onClick={onCreateComms} disabled={isGenerating} className="flex items-center gap-2"><MessageSquare className="h-4 w-4" />{isGenerating?"Generating...":"Create Communications"}</Button>
              )}
              <Button variant={showHistory?"default":"outline"} onClick={()=> { setShowHistory(!showHistory); if(!showHistory) setShowAudit(false); }} className="flex items-center gap-2"><History className="h-4 w-4" />{showHistory?"Hide History":"View History"}</Button>
              {isCompleted && <Button variant={showAudit?"default":"outline"} onClick={()=> { setShowAudit(!showAudit); if(!showAudit) setShowHistory(false); }} className="flex items-center gap-2"><CheckCircle className="h-4 w-4" />{showAudit?"Hide Audit":"View Audit"}</Button>}
              <Button variant="outline">Export Details</Button>
            </div>
            {isGenerating && (
              <div className="mt-4 p-4 border rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div><span className="text-blue-900 text-sm">Communications Generation in Progress</span></div><span className="text-blue-700 font-mono text-xs">{Math.round(progress)}%</span></div>
                  <Progress value={progress} className="w-full h-2" />
                  <div className="flex items-center justify-center py-2"><div className="flex items-center gap-2 px-3 py-1.5 bg-white/70 rounded-full border border-blue-200"><Clock className="h-4 w-4 text-blue-600 animate-spin" /><span className="text-blue-800 text-xs font-medium">Now processing: {workflowSteps[currentStep]?.name}</span></div></div>
                  <div className="flex items-center justify-center"><Button variant="outline" size="sm" onClick={onEmailNotification} className="flex items-center gap-2 bg-white/80 hover:bg-white"><Mail className="h-4 w-4" />Email When Ready</Button></div>
                </div>
              </div>
            )}
            {(showHistory || (showAudit && isCompleted)) && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                {showHistory ? (
                  <div>
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold"><History className="h-4 w-4" />Communication History</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Subject/Content</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockCommHistory.map(comm => (
                          <TableRow key={comm.id}>
                            <TableCell>{comm.date}</TableCell>
                            <TableCell><Badge variant="outline">{comm.type}</Badge></TableCell>
                            <TableCell>{comm.recipient}</TableCell>
                            <TableCell>{comm.subject}</TableCell>
                            <TableCell><Badge className="bg-green-100 text-green-700">{comm.status}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold"><CheckCircle className="h-4 w-4" />Generation Audit Trail</h4>
                    <p className="text-xs text-gray-600 mb-4">Detailed breakdown of the AI generation process, including reasoning, decisions, and data points for each step.</p>
                    <Accordion type="multiple" className="space-y-3">
                      {mockAuditTrail.map((audit, index) => (
                        <AccordionItem key={index} value={`audit-${index}`} className="bg-white rounded-lg border border-slate-200">
                          <AccordionTrigger className="px-5 py-3 hover:no-underline">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">{index + 1}</div>
                                <span className="text-sm text-left font-medium">{audit.step}</span>
                              </div>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 ml-4 text-[11px]">{audit.duration}</Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="space-y-4">
                              <div>
                                <h6 className="mb-2 text-xs font-semibold tracking-wide text-slate-700 uppercase">Reasoning & Analysis</h6>
                                <p className="text-xs text-slate-600 leading-relaxed">{audit.reasoning}</p>
                              </div>
                              <div>
                                <h6 className="mb-2 text-xs font-semibold tracking-wide text-slate-700 uppercase">Key Decisions Made</h6>
                                <ul className="space-y-1">
                                  {audit.decisions.map((d,i)=>(
                                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                                      {d}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h6 className="mb-2 text-xs font-semibold tracking-wide text-slate-700 uppercase">Data Points Considered</h6>
                                <div className="flex flex-wrap gap-2">
                                  {audit.dataPoints.map((p,i)=>(
                                    <Badge key={i} variant="outline" className="bg-gray-50 text-gray-700 text-[10px] font-medium">{p}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h6 className="text-blue-900 mb-1 text-sm font-semibold">Audit Verification</h6>
                          <p className="text-blue-800 text-xs leading-relaxed">All generation steps have been logged and verified. This audit trail provides full transparency into the AI decision-making process and can be used for compliance, quality assurance, and continuous improvement.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {!isGenerating && !isCompleted && <p className="text-xs text-gray-500">Creating communications will generate appropriate messages for relevant stakeholders based on the work item context.</p>}
          </div>
        </CardContent>
      </Card>
      {isCompleted && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="p-6 pt-8 pb-4">
            <CardTitle className="flex items-center gap-2 text-green-800"><CheckCircle className="h-5 w-5" />Generated Communications</CardTitle>
            <p className="text-green-700 text-sm">Communications successfully generated.</p>
          </CardHeader>
          <CardContent className="space-y-6 pb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between"><h4 className="flex items-center gap-2 text-sm font-semibold"><Mail className="h-4 w-4" />Email Communication</h4><div className="flex gap-2"><Button size="sm" variant="outline" className="flex items-center gap-1 text-xs"><Copy className="h-3 w-3" />Copy</Button><Button size="sm" className="flex items-center gap-1 text-xs"><Send className="h-3 w-3" />Send</Button></div></div>
              <div className="bg-white p-4 rounded-lg border"><div className="mb-3 text-sm"><strong>Subject:</strong> {generated.email.subject}</div><div className="whitespace-pre-line text-xs text-gray-600">{generated.email.body}</div></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><h4 className="flex items-center gap-2 text-sm font-semibold"><MessageSquare className="h-4 w-4" />SMS Communication</h4><div className="flex gap-2"><Button size="sm" variant="outline" className="flex items-center gap-1 text-xs"><Copy className="h-3 w-3" />Copy</Button><Button size="sm" className="flex items-center gap-1 text-xs"><Send className="h-3 w-3" />Send</Button></div></div>
              <div className="bg-white p-4 rounded-lg border"><div className="text-xs text-gray-600">{generated.sms.body}</div><div className="text-[10px] text-gray-400 mt-2">Characters: {generated.sms.body.length}/160</div></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
