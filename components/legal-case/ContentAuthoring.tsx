"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Search } from "lucide-react";

type DemoMode = "outages" | "bids" | "communications" | "complaints";
const demoMode: DemoMode = (process.env.NEXT_PUBLIC_DEMO_MODE as DemoMode) || "outages";

interface TemplateDef { name: string; id: string; variables: string[]; type: string; preview: Record<string,string>; }
interface ModeConfig {
  title: string; subtitle: string; listLabel: string; searchPlaceholder: string;
  idKey: string; stageKey?: string; customersKey?: string; identifiedKey?: string; typeKey?: string;
  items: any[]; templates: TemplateDef[]; variableMap: Record<string,(item:any)=>string>; searchKeys: string[];
}
const fmt = (n:any)=>{ const num=Number(n); return Number.isFinite(num)?num.toLocaleString():String(n??""); };

const MODE_CONFIG: Record<DemoMode, ModeConfig> = {
  outages: { title: "Outage Communication Management", subtitle: "Select an outage, choose a template, generate and submit communications.", listLabel: "Select Outage", searchPlaceholder: "Search by outage, location or cause...", idKey: "id", stageKey:"stage", customersKey:"customersCount", identifiedKey:"identified", typeKey:"type", items: [ { id: "INC20485", stage:"STAGE 1", customers:"90,000 customers", customersCount:90000, location:"NYC", type:"Major outage", identified:"19:00 01/02/2025" }, { id: "INC20486", stage:"STAGE 1", customers:"12,000 customers", customersCount:12000, location:"LA", type:"Minor outage", identified:"20:00 01/02/2025" }, { id: "INC20487", stage:"STAGE 1", customers:"145,000 customers", customersCount:145000, location:"NYC", type:"Major outage", identified:"22:00 01/02/2025" }, { id: "INC20488", stage:"STAGE 1", customers:"18,000 customers", customersCount:18000, location:"LA", type:"Minor outage", identified:"23:30 01/02/2025" } ], templates: [ { name:"Initial Outage Notification (Email)", id:"TPL-001", variables:["outageId","location","consumers"], type:"Email", preview:{ Email:`Subject: Service Outage Notification – {outageId}\n\nDear Valued Customer,\n\nWe are currently experiencing a service outage in the {location} area affecting approximately {consumers} customers.\n\nRegards,\nCustomer Service Team`, SMS:`SERVICE ALERT: We're experiencing an outage in {location} affecting ~{consumers} customers. Ref: {outageId}`, Website:`SERVICE UPDATE: We are currently experiencing service issues in {location}. Incident: {outageId}` } }, { name:"Follow-up Restoration Update", id:"TPL-004", variables:["outageId","location","consumers"], type:"Email", preview:{ Email:`Subject: Restoration Progress – {outageId}\n\nUpdate: Technicians are working to restore services in {location}. Approximately {consumers} customers remain impacted. Further updates in 2 hours.` } } ], variableMap:{ outageId:i=>i.id, location:i=>i.location, consumers:i=>fmt(i.customersCount) }, searchKeys:["id","location","type"] },
  bids: { title:"Bid Communication Authoring", subtitle:"Select a bid record, apply a template, generate internal or stakeholder communications.", listLabel:"Select Bid", searchPlaceholder:"Search by bid id, title or region...", idKey:"bidId", stageKey:"stage", identifiedKey:"submitted", typeKey:"category", items:[ { bidId:"BID-1001", title:"Rural Connectivity Expansion", stage:"In Review", amount:1250000, region:"Midwest", category:"Infrastructure", submitted:"15/08/2025" }, { bidId:"BID-1002", title:"NextGen Fiber Backbone", stage:"Shortlisted", amount:2245000, region:"Northeast", category:"Network", submitted:"14/08/2025" }, { bidId:"BID-0996", title:"Emergency Response Upgrade", stage:"Awarded", amount:890000, region:"Southwest", category:"Security", submitted:"10/08/2025" }, { bidId:"BID-0990", title:"Data Center Energy Optimization", stage:"Rejected", amount:640000, region:"West", category:"Sustainability", submitted:"08/08/2025" } ], templates:[ { name:"Bid Submission Acknowledgement (Email)", id:"TPL-BID-001", variables:["bidId","title","amount","region"], type:"Email", preview:{ Email:`Subject: Bid {bidId} Submission Received\n\nYour proposal '{title}' for the {region} region (est. value {amount}) has been successfully submitted and is now queued for initial review.`, SMS:`Bid {bidId} received. Title: {title}. Value {amount}. Region {region}.` } }, { name:"Internal Review Summary", id:"TPL-BID-002", variables:["bidId","title","amount","region"], type:"Email", preview:{ Email:`Subject: Review Summary – {bidId}\n\nBid {bidId} ('{title}') in {region} currently under evaluation. Estimated value: {amount}. Key differentiators compiled.` } } ], variableMap:{ bidId:i=>i.bidId, title:i=>i.title, amount:i=>fmt(i.amount), region:i=>i.region }, searchKeys:["bidId","title","region","category"] },
  communications: { title:"Campaign Content Authoring", subtitle:"Draft and adapt outbound campaign content across channels.", listLabel:"Select Campaign", searchPlaceholder:"Search by id, subject or channel...", idKey:"commId", stageKey:"status", identifiedKey:"sentAt", typeKey:"channel", items:[ { commId:"C-9001", subject:"Scheduled Maintenance Window", status:"Sent", channel:"Email", audience:"Enterprise Customers", sentAt:"16/08/2025", messages:3200 }, { commId:"C-9002", subject:"API Latency Advisory", status:"Queued", channel:"SMS", audience:"Developers", sentAt:"16/08/2025", messages:1800 }, { commId:"C-9003", subject:"Service Restoration Notice", status:"Sent", channel:"Email", audience:"Retail Users", sentAt:"15/08/2025", messages:5400 }, { commId:"C-8999", subject:"Incident Update #2", status:"Draft", channel:"Portal", audience:"All Customers", sentAt:"15/08/2025", messages:0 } ], templates:[ { name:"Campaign Launch (Email)", id:"TPL-COMM-001", variables:["commId","subject","audience","channel"], type:"Email", preview:{ Email:`Subject: Launch – {subject}\n\nCampaign {commId} targeting {audience} will begin distribution across {channel} channel(s) shortly.`, SMS:`{subject} update for {audience}. Ref {commId}.` } }, { name:"Engagement Follow-up", id:"TPL-COMM-002", variables:["commId","subject","audience"], type:"Email", preview:{ Email:`Subject: Engagement Update – {subject}\n\nFollow-up drafted for campaign {commId} – audience: {audience}. Incorporate latest open/click metrics before final send.` } } ], variableMap:{ commId:i=>i.commId, subject:i=>i.subject, audience:i=>i.audience, channel:i=>i.channel }, searchKeys:["commId","subject","channel","audience"] },
  complaints: { title:"Complaint Response Authoring", subtitle:"Prepare and refine response templates for active complaint cases.", listLabel:"Select Case", searchPlaceholder:"Search by case id, category or region...", idKey:"caseId", stageKey:"status", identifiedKey:"submitted", typeKey:"category", items:[ { caseId:"CMP-3001", category:"Billing", region:"West", status:"Open", submitted:"16/08/2025", slaDue:"19/08/2025" }, { caseId:"CMP-3002", category:"Service Quality", region:"Midwest", status:"In Progress", submitted:"15/08/2025", slaDue:"18/08/2025" }, { caseId:"CMP-2998", category:"Onboarding", region:"Northeast", status:"Resolved", submitted:"14/08/2025", slaDue:"17/08/2025" }, { caseId:"CMP-2995", category:"Security", region:"Southwest", status:"Escalated", submitted:"13/08/2025", slaDue:"16/08/2025" } ], templates:[ { name:"Initial Case Acknowledgement", id:"TPL-CMP-001", variables:["caseId","category","region","slaDue"], type:"Email", preview:{ Email:`Subject: We Received Your {category} Case – {caseId}\n\nYour case {caseId} regarding {category} in the {region} region has been logged. Expected resolution before {slaDue}.`, SMS:`Case {caseId} acknowledged. Category: {category}. ETA {slaDue}.` } }, { name:"Resolution Notice", id:"TPL-CMP-002", variables:["caseId","category","region"], type:"Email", preview:{ Email:`Subject: Case {caseId} Resolved\n\nYour {category} case {caseId} has been resolved. Thank you for your patience. Region: {region}.` } } ], variableMap:{ caseId:i=>i.caseId, category:i=>i.category, region:i=>i.region, slaDue:i=>i.slaDue }, searchKeys:["caseId","category","region"] }
};

export function ContentAuthoring() {
  const cfg = MODE_CONFIG[demoMode];
  const [selectedId, setSelectedId] = useState<string>(cfg.items[0]?.[cfg.idKey] ?? "");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedDraft, setGeneratedDraft] = useState("");
  const [channel, setChannel] = useState("Email");

  const filteredItems = useMemo(()=>{
    const q = searchQuery.toLowerCase();
    return cfg.items.filter(it => cfg.searchKeys.some(k => String(it[k]??"").toLowerCase().includes(q)));
  },[cfg, searchQuery]);

  const currentItem = useMemo(()=> cfg.items.find(i => String(i[cfg.idKey])===selectedId), [cfg, selectedId]);
  const currentTemplate = useMemo(()=> cfg.templates.find(t=> t.id===selectedTemplate), [cfg, selectedTemplate]);

  function populate(text:string, item:any){
    return text.replace(/\{(\w+)\}/g,(_,k)=>{ const fn = cfg.variableMap[k]; try { return fn? fn(item):`{${k}}`; } catch { return `{${k}}`; }});
  }

  function handleGenerateDraft(){
    if(!currentItem || !currentTemplate) return;
    const body = currentTemplate.preview[channel] || currentTemplate.preview[currentTemplate.type] || "";
    if(!body) return;
    setGeneratedDraft(populate(body,currentItem));
    setCurrentStep(3);
  }

  const getWordCount = (text:string)=>{ const words=text.trim().split(/\s+/).filter(w=>w.length>0).length; return { words, characters:text.length }; };
  const getGeneratedDescription = ()=> currentTemplate && currentItem ? `Generated from ${currentTemplate.id} for ${String(currentItem[cfg.idKey])} (Channel: ${channel})` : "";
  const steps = [ { number:1, title:"Select & Template", active: currentStep>=1 }, { number:2, title:"Generate Draft", active: currentStep>=2 }, { number:3, title:"Review Draft", active: currentStep>=3 }, { number:4, title:"Submit Comms", active: currentStep>=4 } ];

  return (
    <div className="bg-gray-50 min-h-screen p-6 space-y-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{cfg.title}</h1>
            <p className="text-gray-600 mt-1">{cfg.subtitle}</p>
            <p className="text-xs text-gray-500 mt-1">Mode: {demoMode}</p>
        </div>
        <div className="flex items-center space-x-8">
          {steps.map(step=> (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium cursor-pointer ${ step.active?"bg-blue-600 border-blue-600 text-white":"border-gray-300 text-gray-500"}`}>{step.number}</div>
              <span className={`ml-2 text-sm font-medium cursor-pointer ${ step.active?"text-gray-900":"text-gray-500"}`}>{step.title}</span>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Guidelines:</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"/>Ensure all details are accurate</li>
            <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"/>Include timelines / next steps</li>
            <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"/>Use clear, concise language</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1">
          <Card className="border border-gray-200"><CardContent className="py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{cfg.listLabel}</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder={cfg.searchPlaceholder} value={searchQuery} onChange={e=> setSearchQuery(e.target.value)} className="pl-10 cursor-pointer" />
            </div>
            <div className="space-y-3">
              {filteredItems.map(item=> { const idVal=String(item[cfg.idKey]); const isSelected= selectedId===idVal; const stage= cfg.stageKey? item[cfg.stageKey]:undefined; const volume = cfg.customersKey? item[cfg.customersKey] : item.messages ? `${fmt(item.messages)} messages` : undefined; const identified= cfg.identifiedKey? item[cfg.identifiedKey]: undefined; const typeVal = cfg.typeKey? item[cfg.typeKey]: undefined; return (
                <div key={idVal} onClick={()=> setSelectedId(idVal)} className={`p-3 rounded-lg border cursor-pointer transition-colors ${isSelected?"border-blue-600 bg-blue-50":"border-gray-200 hover:border-gray-300"}`}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center space-x-3"><span className="font-medium text-gray-900">{idVal}</span>{stage && <span className="text-sm text-gray-500">{stage}</span>}</div>
                    {volume && <span className="text-sm text-gray-600">{volume}</span>}
                  </div>
                  {(item.location || item.region || item.audience) && <div className="text-sm text-gray-600 mb-1">{item.location || item.region || item.audience}</div>}
                  <div className="flex justify-between items-center">
                    {typeVal && <Badge variant={String(typeVal).toLowerCase().includes("major") || String(typeVal).toLowerCase().includes("escalated")?"destructive":"secondary"} className="cursor-pointer">{typeVal}</Badge>}
                    {identified && <div className="text-xs text-gray-500">{cfg.identifiedKey === "submitted"?"Submitted": cfg.identifiedKey === "sentAt"?"Sent": cfg.identifiedKey === "slaDue"?"SLA":"Identified"}: {identified}</div>}
                  </div>
                </div> ); })}
            </div>
          </CardContent></Card>
        </div>
        <div className="col-span-1"><Card className="border border-gray-200"><CardContent className="py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Templates</h3>
          <div className="space-y-3">
            {cfg.templates.map(t=> (
              <div key={t.id} onClick={()=> setSelectedTemplate(t.id)} className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedTemplate===t.id?"border-blue-600 bg-blue-50":"border-gray-200 hover:border-gray-300"}`}>
                <div className="font-medium text-gray-900 text-sm">{t.name}</div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-500">{t.id} • Variables: {t.variables.length}</div>
                  <Badge variant="outline" className="text-xs cursor-pointer">{t.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent></Card></div>
        <div className="col-span-1"><Card className="border border-gray-200"><CardContent className="py-6">
          <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-gray-900">{currentTemplate?.name || "Select template"}</h3>
            <Select value={channel} onValueChange={setChannel}><SelectTrigger className="w-32 cursor-pointer"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Email" className="cursor-pointer">Email</SelectItem><SelectItem value="SMS" className="cursor-pointer">SMS</SelectItem><SelectItem value="Website" className="cursor-pointer">Website</SelectItem></SelectContent></Select></div>
          <div className="space-y-4">
            <div><h4 className="font-medium text-gray-900 mb-2">Template Variables:</h4><div className="flex flex-wrap gap-2">{currentTemplate?.variables.map(v=> <Badge key={v} variant="outline" className="text-xs">{v}</Badge>) || <span className="text-sm text-gray-500">Select a template</span>}</div></div>
            <div><h4 className="font-medium text-gray-900 mb-2">Preview:</h4><div className="text-sm text-gray-600 bg-gray-50 p-3 rounded whitespace-pre-line">{(()=>{ if(!selectedTemplate || !currentTemplate || !currentItem) return "Select a template to preview populated content."; const text = currentTemplate.preview[channel] || currentTemplate.preview[currentTemplate.type] || ""; if(!text) return "Template preview unavailable."; const populated = populate(text,currentItem); return (<><>{populated}</><div className="mt-3 pt-3 border-t border-gray-200"><span className="text-xs text-gray-500">• Preview populated with selected record data</span></div><div className="mt-1"><span className="text-xs text-green-600 font-medium">Ready to generate: Template and record selected.</span></div></>); })()}</div></div>
            <Button onClick={handleGenerateDraft} disabled={!selectedTemplate || !currentItem} className="w-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer disabled:cursor-not-allowed">Generate Draft</Button>
          </div>
        </CardContent></Card></div>
        <div className="col-span-1"><Card className="border border-gray-200"><CardContent className="py-6">
          <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-gray-900">Generated Communication Draft</h3>{generatedDraft && <div className="flex items-center space-x-2"><Badge variant="outline" className="text-green-600 border-green-600">Generated</Badge><span className="text-xs text-gray-500">{getWordCount(generatedDraft).words} words • {getWordCount(generatedDraft).characters} characters</span></div>}</div>
          {generatedDraft ? (<div className="space-y-4"><div className="text-sm text-gray-600 mb-2">{getGeneratedDescription()}</div><Textarea value={generatedDraft} onChange={e=> setGeneratedDraft(e.target.value)} className="min-h-[200px] cursor-pointer" placeholder="Generated content will appear here..." /><div className="flex space-x-2"><Button variant="outline" className="cursor-pointer bg-transparent">Save draft</Button><Button className="bg-gray-900 hover:bg-gray-800 text-white cursor-pointer">Submit for Approval</Button></div></div>):(<p className="text-sm text-gray-500 text-center py-8">No draft generated</p>)}
        </CardContent></Card></div>
      </div>
    </div>
  );
}
