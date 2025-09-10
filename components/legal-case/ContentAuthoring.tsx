"use client";
import { useState, useEffect, useMemo } from "react";
import { WorkItemList, WorkItem } from "./work-items/WorkItemList";
import { WorkItemDetail } from "./work-items/WorkItemDetail";

type DemoMode = "outages" | "bids" | "communications" | "complaints";
const demoMode: DemoMode = (process.env.NEXT_PUBLIC_DEMO_MODE as DemoMode) || "outages";

// Mode-specific mock datasets so each demo mode surfaces relevant work items
const MODE_ITEMS: Record<DemoMode, WorkItem[]> = {
  outages: [
    { id: "OUT-20485", type: "outage", title: "Major Backbone Outage – NYC", description: "Core backbone disruption impacting high-density metro segment; customers experiencing loss of service.", priority: "critical", status: "in-progress", createdAt: "2025-09-10", assignee: "Mike Chen", location: "NYC Core" },
    { id: "OUT-20488", type: "outage", title: "Fiber Degradation – LA Sector 3", description: "Signal attenuation detected; proactive maintenance window opened.", priority: "high", status: "open", createdAt: "2025-09-09", assignee: "Sarah Johnson", location: "LA Sector 3" },
    { id: "OUT-20492", type: "outage", title: "Regional Packet Loss – Midwest", description: "Intermittent packet loss reported across aggregation layer; monitoring engaged.", priority: "medium", status: "in-progress", createdAt: "2025-09-09", assignee: "Tom Anderson", location: "Midwest Region" },
    { id: "OUT-20497", type: "outage", title: "Planned Maintenance Notice – Northeast", description: "Scheduled infrastructure refresh; brief service interruptions expected overnight.", priority: "low", status: "pending", createdAt: "2025-09-08", assignee: "David Wilson", location: "NE Hub" }
  ],
  bids: [
    { id: "BID-1001", type: "bid", title: "Rural Connectivity Expansion", description: "Proposal to extend fiber to underserved rural clusters.", priority: "high", status: "pending", createdAt: "2025-09-07", assignee: "Jennifer Martinez", location: "Rural Cluster A" },
    { id: "BID-1002", type: "bid", title: "Enterprise Data Center Upgrade", description: "High-availability infrastructure modernization bid.", priority: "medium", status: "open", createdAt: "2025-09-08", assignee: "Mark Patel", location: "Enterprise Zone" },
    { id: "BID-1003", type: "bid", title: "Metro Loop Fiber Build", description: "Strategic metro loop deployment for redundancy.", priority: "critical", status: "in-progress", createdAt: "2025-09-09", assignee: "Lisa Brown", location: "Metro Core" },
    { id: "BID-1004", type: "bid", title: "Public Sector Cloud Access", description: "Bid to provide secure cloud transit for government agencies.", priority: "high", status: "pending", createdAt: "2025-09-09", assignee: "Sarah Johnson", location: "Gov Region" }
  ],
  communications: [
    { id: "COM-9001", type: "comms", title: "API Latency Advisory Follow-up", description: "Planned follow-up for prior latency bulletin including mitigation summary.", priority: "low", status: "resolved", createdAt: "2025-09-06", assignee: "David Wilson" },
    { id: "COM-9002", type: "comms", title: "Scheduled Maintenance Window Notice", description: "Customer notification for weekend maintenance cycle.", priority: "medium", status: "open", createdAt: "2025-09-09", assignee: "Grace Lee" },
    { id: "COM-9003", type: "comms", title: "New Feature Launch Brief", description: "Outbound announcement for analytics dashboard rollout.", priority: "medium", status: "pending", createdAt: "2025-09-08", assignee: "Andre Gomez" },
    { id: "COM-9004", type: "comms", title: "Service Reliability Summary Q3", description: "Quarterly reliability figures and proactive improvement messaging.", priority: "low", status: "resolved", createdAt: "2025-09-07", assignee: "Claire Young" }
  ],
  complaints: [
    { id: "CMP-3001", type: "complaint", title: "Billing Discrepancy – Enterprise Client", description: "High-value customer disputing overage fees on last cycle.", priority: "high", status: "open", createdAt: "2025-09-08", assignee: "Lisa Brown", location: "Enterprise Segment" },
    { id: "CMP-3002", type: "complaint", title: "Onboarding Delay Concern", description: "Customer reporting delayed provisioning timeline.", priority: "medium", status: "in-progress", createdAt: "2025-09-09", assignee: "Sarah Johnson", location: "Provisioning Queue" },
    { id: "CMP-3003", type: "complaint", title: "Security Notification Clarity", description: "Feedback about unclear severity in prior security bulletin.", priority: "low", status: "resolved", createdAt: "2025-09-07", assignee: "David Wilson" },
    { id: "CMP-3004", type: "complaint", title: "Support Response Time Escalation", description: "Escalation citing extended initial response time on tickets.", priority: "critical", status: "open", createdAt: "2025-09-10", assignee: "Mike Chen", location: "Global Queue" }
  ]
};

export function ContentAuthoring() {
  const [selectedWorkItem, setSelectedWorkItem] = useState<WorkItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const items = useMemo(()=> MODE_ITEMS[demoMode] || MODE_ITEMS.outages, [demoMode]);

  useEffect(()=> { // auto select first relevant item when mode changes
    setSelectedWorkItem(items[0] || null);
    setIsGenerating(false); setCurrentStep(0); setProgress(0); setIsCompleted(false);
  }, [items]);

  function handleSelect(item: WorkItem){
    setSelectedWorkItem(item);
    setIsGenerating(false); setCurrentStep(0); setProgress(0); setIsCompleted(false);
  }

  function startGeneration(){
    setIsGenerating(true); setCurrentStep(0); setProgress(0); setIsCompleted(false);
  }
  function refineGeneration(prompt: string){
    // reuse generation pipeline for refinement
    setIsGenerating(true); setCurrentStep(0); setProgress(0); setIsCompleted(false);
  }
  function emailNotification(){
    // simulate opting for email notification; stop progress
    setIsGenerating(false); setCurrentStep(0); setProgress(0); setIsCompleted(false);
  }

  // Progress simulation
  useEffect(()=>{
    if(!isGenerating) return; const stepDurations = [3700, 2400, 1200, 4800, 1600, 2900]; const total = stepDurations.reduce((a,b)=>a+b,0); const start = Date.now(); const names = ["Impact Assessment","Stakeholder Identification","Template Selection","Content Generation","Approval Workflow","Distribution Setup"]; const interval = setInterval(()=>{ const elapsed = Date.now()-start; const pct = Math.min(elapsed/total*100, 100); if(pct>=100){ setIsGenerating(false); setIsCompleted(true); setProgress(100); clearInterval(interval); return; } setProgress(pct); let acc=0; let stepIndex=0; for(let i=0;i<stepDurations.length;i++){ if(elapsed < acc + stepDurations[i]){ stepIndex=i; break; } acc+=stepDurations[i]; stepIndex=i+1; } if(stepIndex>5) stepIndex=5; setCurrentStep(stepIndex); }, 80); return ()=> clearInterval(interval); },[isGenerating]);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {({
            outages: "Create Outage Communications",
            bids: "Create Bid Communications",
            communications: "Create Campaign Communications",
            complaints: "Create Complaint Communications"
          } as Record<DemoMode,string>)[demoMode] || "Create Communications"}
        </h1>
  <p className="text-gray-600 text-sm mt-1">Mode filtered: <span className="font-medium">{demoMode}</span> ({items.length} work items)</p>
      </div>
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-160px)]">
  <div className="col-span-4 h-full overflow-auto pr-3 pl-2 border-r border-gray-200">
          <WorkItemList workItems={items} onItemClick={handleSelect} selectedItemId={selectedWorkItem?.id} />
        </div>
  <div className="col-span-8 h-full overflow-auto pl-10 pr-6">
          {selectedWorkItem ? (
            <WorkItemDetail workItem={selectedWorkItem} onCreateComms={startGeneration} onRefineComms={refineGeneration} isGenerating={isGenerating} currentStep={currentStep} progress={progress} onEmailNotification={emailNotification} isCompleted={isCompleted} />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">Select a work item to begin</div>
          )}
        </div>
      </div>
    </div>
  );
}
