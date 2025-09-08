"use client";

// Adaptive Records view. Changes dataset & columns based on NEXT_PUBLIC_DEMO_MODE
// Valid modes: outages | bids | communications | complaints
import { useMemo, useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { CheckCircle, AlertTriangle } from "lucide-react";

type DemoMode = "outages" | "bids" | "communications" | "complaints";
const demoMode: DemoMode =
  (process.env.NEXT_PUBLIC_DEMO_MODE as DemoMode) || "outages";

interface ColumnDef { key: string; label: string; }
interface RecordItem { [k: string]: any; }
interface ModeConfig {
  title: string;
  description: string;
  idKey: string; // primary identifier key for selection
  columns: ColumnDef[];
  records: RecordItem[];
  searchKeys: string[];
  regionKey?: string;
  categoryKey?: string;
  detailStrategy: "stages" | "kv"; // how to render detail panel
}

// Shared outage stage timeline (only used in outages mode)
const OUTAGE_STAGE_TIMELINE = [
  {
    stage: "Stage 1",
    time: "19:00 01/02/2025",
    percentage: "100%",
    consumers: "90,000 consumers",
    status: "complete",
    comms: [
      { type: "Email comms", status: "Sent", icon: "check" },
      { type: "SMS comms", status: "Sent", icon: "check" },
      { type: "Website", status: "Updated", icon: "check" },
      { type: "ServiceNow", status: "Sent", icon: "check" },
    ],
  },
  {
    stage: "Stage 2",
    time: "19:00 01/02/2025",
    percentage: "98%",
    consumers: "300,000 consumers",
    status: "current",
    comms: [
      { type: "Email comms", status: "Exceed", icon: "warning" },
      { type: "SMS comms", status: "Sent", icon: "check" },
      { type: "Spatial Buzz", status: "Sent", icon: "check" },
      { type: "ServiceNow", status: "Sent", icon: "check" },
    ],
  },
  {
    stage: "Stage 3",
    time: "21:00 01/02/2025",
    percentage: "100%",
    consumers: "90,000 consumers",
    status: "complete",
    comms: [
      { type: "Email comms", status: "Sent", icon: "check" },
      { type: "SMS comms", status: "Sent", icon: "check" },
      { type: "Spatial Buzz", status: "Sent", icon: "check" },
      { type: "ServiceNow", status: "Sent", icon: "check" },
    ],
  },
  {
    stage: "Stage 4",
    time: "23:00 01/02/2025",
    percentage: "100%",
    consumers: "90,000 consumers",
    status: "complete",
    comms: [
      { type: "Email comms", status: "Sent", icon: "check" },
      { type: "SMS comms", status: "Sent", icon: "check" },
      { type: "Spatial Buzz", status: "Sent", icon: "check" },
      { type: "ServiceNow", status: "Sent", icon: "check" },
    ],
  },
];

// Mode-specific datasets
const MODE_CONFIG: Record<DemoMode, ModeConfig> = {
  outages: {
    title: "Comms Records (Outages)",
    description:
      "Stage-wise communications sent during unplanned outages. Select a record to view the compliance timeline.",
    idKey: "id",
    columns: [
      { key: "id", label: "Outage ID" },
      { key: "type", label: "Type" },
      { key: "location", label: "Location" },
      { key: "date", label: "Date" },
      { key: "consumers", label: "Consumers" },
      { key: "_actions", label: "" },
    ],
    records: [
      { id: "INC20485", type: "Major", location: "NYC", date: "2025-02-01T19:00:00", consumers: 90000 },
      { id: "INC20486", type: "Minor", location: "LA", date: "2025-02-01T20:00:00", consumers: 12000 },
      { id: "INC20487", type: "Major", location: "NYC", date: "2025-02-01T22:00:00", consumers: 145000 },
      { id: "INC20488", type: "Minor", location: "LA", date: "2025-02-01T23:30:00", consumers: 18000 },
      { id: "INC20489", type: "Major", location: "NYC", date: "2025-02-02T07:45:00", consumers: 210000 },
      { id: "INC20490", type: "Minor", location: "LA", date: "2025-02-02T09:10:00", consumers: 9500 },
    ],
    searchKeys: ["id", "location", "type"],
    regionKey: "location",
    categoryKey: "type",
    detailStrategy: "stages",
  },
  bids: {
    title: "Comms Records (Bids)",
    description:
      "Submitted bid related messaging and tracking records across regions.",
    idKey: "bidId",
    columns: [
      { key: "bidId", label: "Bid ID" },
      { key: "title", label: "Title" },
      { key: "region", label: "Region" },
      { key: "category", label: "Category" },
      { key: "amount", label: "Amount (USD)" },
      { key: "submitted", label: "Submitted" },
      { key: "status", label: "Status" },
      { key: "_actions", label: "" },
    ],
    records: [
      { bidId: "BID-1001", title: "Rural Connectivity Expansion", region: "Midwest", category: "Infrastructure", amount: 1250000, submitted: "2025-08-15T10:12:00", status: "Under Review" },
      { bidId: "BID-1002", title: "NextGen Fiber Backbone", region: "Northeast", category: "Network", amount: 2245000, submitted: "2025-08-14T09:45:00", status: "Shortlisted" },
      { bidId: "BID-0996", title: "Emergency Response Upgrade", region: "Southwest", category: "Security", amount: 890000, submitted: "2025-08-10T15:30:00", status: "Awarded" },
      { bidId: "BID-0990", title: "Data Center Energy Optimization", region: "West", category: "Sustainability", amount: 640000, submitted: "2025-08-08T11:02:00", status: "Rejected" },
    ],
    searchKeys: ["bidId", "title", "region", "category"],
    regionKey: "region",
    categoryKey: "category",
    detailStrategy: "kv",
  },
  communications: {
    title: "Comms Records (Outbound)",
    description:
      "Outbound communication artifacts, delivery channels and current state.",
    idKey: "commId",
    columns: [
      { key: "commId", label: "Comm ID" },
      { key: "subject", label: "Subject" },
      { key: "channel", label: "Channel" },
      { key: "audience", label: "Audience" },
      { key: "sentAt", label: "Sent" },
      { key: "status", label: "Status" },
      { key: "_actions", label: "" },
    ],
    records: [
      { commId: "C-9001", subject: "Scheduled Maintenance Window", channel: "Email", audience: "Enterprise Customers", sentAt: "2025-08-16T08:00:00", status: "Sent" },
      { commId: "C-9002", subject: "API Latency Advisory", channel: "SMS", audience: "Developers", sentAt: "2025-08-16T09:15:00", status: "Queued" },
      { commId: "C-9003", subject: "Service Restoration Notice", channel: "Email", audience: "Retail Users", sentAt: "2025-08-15T18:42:00", status: "Sent" },
      { commId: "C-8999", subject: "Incident Update #2", channel: "Portal", audience: "All Customers", sentAt: "2025-08-15T14:05:00", status: "Draft" },
    ],
    searchKeys: ["commId", "subject", "channel", "audience"],
    detailStrategy: "kv",
  },
  complaints: {
    title: "Comms Records (Complaints)",
    description:
      "Complaint case communication tracking & SLA progression.",
    idKey: "caseId",
    columns: [
      { key: "caseId", label: "Case ID" },
      { key: "category", label: "Category" },
      { key: "region", label: "Region" },
      { key: "submitted", label: "Submitted" },
      { key: "slaDue", label: "SLA Due" },
      { key: "status", label: "Status" },
      { key: "_actions", label: "" },
    ],
    records: [
      { caseId: "CMP-3001", category: "Billing", region: "West", submitted: "2025-08-16T07:30:00", slaDue: "2025-08-19T07:30:00", status: "Open" },
      { caseId: "CMP-3002", category: "Service Quality", region: "Midwest", submitted: "2025-08-15T16:12:00", slaDue: "2025-08-18T16:12:00", status: "In Progress" },
      { caseId: "CMP-2998", category: "Onboarding", region: "Northeast", submitted: "2025-08-14T11:05:00", slaDue: "2025-08-17T11:05:00", status: "Resolved" },
      { caseId: "CMP-2995", category: "Security", region: "Southwest", submitted: "2025-08-13T09:40:00", slaDue: "2025-08-16T09:40:00", status: "Escalated" },
    ],
    searchKeys: ["caseId", "category", "region"],
    regionKey: "region",
    categoryKey: "category",
    detailStrategy: "kv",
  },
};

function formatDate(value?: string | number) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

function statusBadgeStyle(status: string) {
  const s = status.toLowerCase();
  if (["sent", "resolved", "awarded"].includes(s))
    return "bg-green-100 text-green-700 border-green-200";
  if (["open", "draft", "queued", "stage 1", "under review"].includes(s))
    return "bg-blue-100 text-blue-700 border-blue-200";
  if (["shortlisted", "in progress"].includes(s))
    return "bg-amber-100 text-amber-700 border-amber-200";
  if (["rejected", "escalated"].includes(s))
    return "bg-red-100 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export function RecordsView() {
  const cfg = MODE_CONFIG[demoMode];

  // Filters / state
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 5;

  const idOptions = useMemo(() => cfg.records.map(r => String(r[cfg.idKey])), [cfg]);
  const regionOptions = useMemo(() => cfg.regionKey ? Array.from(new Set(cfg.records.map(r => r[cfg.regionKey!]))) : [], [cfg]);
  const categoryOptions = useMemo(() => cfg.categoryKey ? Array.from(new Set(cfg.records.map(r => r[cfg.categoryKey!]))) : [], [cfg]);

  const filtered = useMemo(() => {
    let data = [...cfg.records];
    if (search) {
      const lower = search.toLowerCase();
      data = data.filter(r => cfg.searchKeys.some(k => String(r[k] ?? "").toLowerCase().includes(lower)));
    }
    if (selectedId !== "all") data = data.filter(r => String(r[cfg.idKey]) === selectedId);
    if (cfg.regionKey && selectedRegion !== "all") data = data.filter(r => String(r[cfg.regionKey!]).toLowerCase() === selectedRegion.toLowerCase());
    if (cfg.categoryKey && selectedCategory !== "all") data = data.filter(r => String(r[cfg.categoryKey!]).toLowerCase() === selectedCategory.toLowerCase());
    if (startDate) {
      const s = new Date(startDate).getTime();
      data = data.filter(r => {
        const dateField = r.date || r.submitted || r.sentAt || r.identified || r.slaDue;
        if (!dateField) return true;
        return new Date(dateField).getTime() >= s;
      });
    }
    if (endDate) {
      const e = new Date(endDate).getTime();
      data = data.filter(r => {
        const dateField = r.date || r.submitted || r.sentAt || r.identified || r.slaDue;
        if (!dateField) return true;
        return new Date(dateField).getTime() <= e;
      });
    }
    return data;
  }, [cfg, search, selectedId, selectedRegion, selectedCategory, startDate, endDate]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageSlice = filtered.slice(startIndex, startIndex + itemsPerPage);

  function resetPagination() { setCurrentPage(1); }

  function handleSelect(record: RecordItem) {
    setSelectedRecord(record);
    setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{cfg.title}</h1>
        <p className="text-gray-600">{cfg.description}</p>
        <p className="text-xs text-gray-500">Mode: {demoMode}</p>
      </div>

      {/* Filters */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              placeholder="Search..."
              value={search}
              onChange={e => { setSearch(e.target.value); resetPagination(); }}
              className="flex-1 min-w-72 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Select value={selectedId} onValueChange={v => { setSelectedId(v); resetPagination(); }}>
              <SelectTrigger className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="All IDs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All IDs</SelectItem>
                {idOptions.map(id => <SelectItem key={id} value={id}>{id}</SelectItem>)}
              </SelectContent>
            </Select>
            {cfg.regionKey && (
              <Select value={selectedRegion} onValueChange={v => { setSelectedRegion(v); resetPagination(); }}>
                <SelectTrigger className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regionOptions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            {cfg.categoryKey && (
              <Select value={selectedCategory} onValueChange={v => { setSelectedCategory(v); resetPagination(); }}>
                <SelectTrigger className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            <Input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); resetPagination(); }} className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
            <Input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); resetPagination(); }} className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer" onClick={()=>{/* state already bound */}}>Apply</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 border-b border-gray-200">
                {cfg.columns.map(col => (
                  <TableHead key={col.key} className="font-semibold text-gray-700 cursor-default">{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageSlice.map(rec => (
                <TableRow key={String(rec[cfg.idKey])} className="hover:bg-gray-50/50 border-b border-gray-100 cursor-default">
                  {cfg.columns.map(col => {
                    if (col.key === "_actions") {
                      return (
                        <TableCell key={col.key}>
                          <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 font-medium cursor-pointer" onClick={() => handleSelect(rec)}>View</Button>
                        </TableCell>
                      );
                    }
                    const value = rec[col.key];
                    if (["date", "submitted", "sentAt", "slaDue"].includes(col.key)) {
                      return <TableCell key={col.key} className="text-gray-700">{formatDate(value)}</TableCell>;
                    }
                    if (col.key === "amount" && typeof value === "number") {
                      return <TableCell key={col.key} className="text-gray-700">{value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</TableCell>;
                    }
                    if (col.key === "status") {
                      return <TableCell key={col.key}><Badge variant="outline" className={statusBadgeStyle(String(value||""))}>{value}</Badge></TableCell>;
                    }
                    if (col.key === "type") {
                      const major = String(value).toLowerCase() === "major";
                      return (
                        <TableCell key={col.key}>
                          <Badge className={major ? "bg-red-100 text-red-700 border-red-200" : "bg-gray-100 text-gray-700 border-gray-200"} variant={major?"destructive":"secondary"}>{String(value)}</Badge>
                        </TableCell>
                      );
                    }
                    if (col.key === cfg.idKey) {
                      return <TableCell key={col.key} className="font-medium text-gray-900">{String(value)}</TableCell>;
                    }
                    return <TableCell key={col.key} className="text-gray-700">{String(value ?? "")}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {filtered.length === 0 ? "0" : `${startIndex + 1}–${Math.min(startIndex + itemsPerPage, filtered.length)}`} of {filtered.length}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={currentPage === 1} onClick={()=> setCurrentPage(p => Math.max(1, p-1))} className={currentPage===1?"text-gray-400 bg-white border-gray-200 cursor-not-allowed":"text-gray-700 hover:bg-gray-50 bg-white border-gray-200 hover:border-gray-300 cursor-pointer"}>Previous</Button>
              <Button variant="outline" disabled={currentPage === totalPages} onClick={()=> setCurrentPage(p => Math.min(totalPages, p+1))} className={currentPage===totalPages?"text-gray-400 bg-white border-gray-200 cursor-not-allowed":"text-gray-700 hover:bg-gray-50 bg-white border-gray-200 hover:border-gray-300 cursor-pointer"}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Panel */}
      {selectedRecord && (
        <Card ref={detailsRef} className="bg-white shadow-sm border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 cursor-pointer">Details</Button>
              <span className="text-sm text-gray-500">Selected {cfg.idKey}: {String(selectedRecord[cfg.idKey])}</span>
              <Button variant="ghost" className="ml-auto text-xs" onClick={()=> setSelectedRecord(null)}>Close</Button>
            </div>
            {cfg.detailStrategy === "stages" ? (
              <div className="px-2 md:px-6 py-4 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Comms record for {String(selectedRecord[cfg.idKey])}</h3>
                  <p className="text-gray-500">Last updated recently</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {OUTAGE_STAGE_TIMELINE.map((stage, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${stage.status === "complete" ? "bg-green-500 border-green-500" : stage.status === "current" ? "bg-orange-400 border-orange-400" : "bg-gray-200 border-gray-300"}`}>
                          {stage.status === "complete" && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{stage.stage}</h4>
                          <p className="text-sm text-gray-500">{stage.time}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900">{stage.percentage}</span>
                          <span className="text-gray-500">{stage.consumers}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900">Comms compliance</h5>
                        {stage.comms.map((comm, ci) => (
                          <div key={ci} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{comm.type}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${comm.status === "Exceed" ? "text-orange-600" : "text-gray-500"}`}>{comm.status}</span>
                              {comm.icon === "check" && <CheckCircle className="w-4 h-4 text-blue-500" />}
                              {comm.icon === "warning" && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="px-2 md:px-6 py-4 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Record details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(selectedRecord).map(([k,v]) => (
                    <div key={k} className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-gray-500">{k}</p>
                      <p className="text-sm font-medium text-gray-800 break-words">{["date","submitted","sentAt","slaDue"].includes(k) ? formatDate(String(v)) : String(v)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
