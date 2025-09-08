"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
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

// Demo mode (set via NEXT_PUBLIC_DEMO_MODE in .env.local)
type DemoMode = "outages" | "bids" | "communications" | "complaints";
const demoMode: DemoMode =
  (process.env.NEXT_PUBLIC_DEMO_MODE as DemoMode) || "outages";

interface ColumnDef {
  key: string;
  label: string;
}

interface RecordItem {
  [k: string]: any;
  status?: string;
  date?: string;
  region?: string;
  category?: string;
}

interface ModeConfig {
  title: string;
  description: string;
  columns: ColumnDef[];
  records: RecordItem[];
  idKey: string; // primary identifier key
  searchKeys: string[];
  regionKey?: string;
  categoryKey?: string;
}

// --- DATASETS --------------------------------------------------------------

const MODE_CONFIG: Record<DemoMode, ModeConfig> = {
  outages: {
    title: "Outage Communication Records",
    description:
      "Filter, find and extract notification records sent to customers during an outage.",
    idKey: "incident",
    columns: [
      { key: "incident", label: "Incident" },
      { key: "region", label: "Region" },
      { key: "acma", label: "ACMA" },
      { key: "cause", label: "Cause of outage" },
      { key: "comms", label: "Comms records" },
      { key: "identified", label: "Identified" },
      { key: "status", label: "Status" },
    ],
    records: [
      {
        incident: "NO-500",
        region: "Sydney Outage 3",
        acma: "SignalPoint Local Outage (Regional)",
        cause: "Sydney Outage 3",
        identified: "2025-08-16T21:59:00",
        status: "STAGE 1",
      },
      {
        incident: "NO-508",
        region: "Network connectivity issue in Sydney CBD area",
        acma: "Major outage",
        cause: "Network connectivity issue in Sydney CBD area",
        identified: "2025-08-16T21:58:43",
        status: "STAGE 1",
      },
      {
        incident: "NO-501",
        region: "Sydney Outage",
        acma: "SignalPoint Local Outage (Regional)",
        cause: "Sydney Outage",
        identified: "2025-08-16T19:07:04",
        status: "STAGE 1",
      },
      {
        incident: "NO-499",
        region: "INC10 - Major Outage",
        acma: "Major outage",
        cause: "INC10 - Major Outage",
        identified: "2025-08-14T14:47:07",
        status: "Done",
      },
      {
        incident: "NO-498",
        region: "INC1 - Major Outage",
        acma: "Major outage",
        cause: "INC1 - Major Outage",
        identified: "2025-08-14T14:47:06",
        status: "Done",
      },
    ],
    searchKeys: ["incident", "region", "cause", "acma"],
    regionKey: "region",
  },

  bids: {
    title: "Bid Submissions Overview",
    description:
      "Monitor and review incoming bids across regions and categories.",
    idKey: "bidId",
    columns: [
      { key: "bidId", label: "Bid ID" },
      { key: "title", label: "Title" },
      { key: "region", label: "Region" },
      { key: "category", label: "Category" },
      { key: "amount", label: "Amount (USD)" },
      { key: "submitted", label: "Submitted" },
      { key: "status", label: "Status" },
    ],
    records: [
      {
        bidId: "BID-1001",
        title: "Rural Connectivity Expansion",
        region: "Midwest",
        category: "Infrastructure",
        amount: 1250000,
        submitted: "2025-08-15T10:12:00",
        status: "Under Review",
      },
      {
        bidId: "BID-1002",
        title: "NextGen Fiber Backbone",
        region: "Northeast",
        category: "Network",
        amount: 2245000,
        submitted: "2025-08-14T09:45:00",
        status: "Shortlisted",
      },
      {
        bidId: "BID-0996",
        title: "Emergency Response Upgrade",
        region: "Southwest",
        category: "Security",
        amount: 890000,
        submitted: "2025-08-10T15:30:00",
        status: "Awarded",
      },
      {
        bidId: "BID-0990",
        title: "Data Center Energy Optimization",
        region: "West",
        category: "Sustainability",
        amount: 640000,
        submitted: "2025-08-08T11:02:00",
        status: "Rejected",
      },
    ],
    searchKeys: ["bidId", "title", "region", "category"],
    regionKey: "region",
    categoryKey: "category",
  },

  communications: {
    title: "Outbound Communications",
    description:
      "Track templated communications, delivery channels and statuses.",
    idKey: "commId",
    columns: [
      { key: "commId", label: "Comm ID" },
      { key: "subject", label: "Subject" },
      { key: "channel", label: "Channel" },
      { key: "audience", label: "Audience" },
      { key: "sentAt", label: "Sent" },
      { key: "status", label: "Status" },
    ],
    records: [
      {
        commId: "C-9001",
        subject: "Scheduled Maintenance Window",
        channel: "Email",
        audience: "Enterprise Customers",
        sentAt: "2025-08-16T08:00:00",
        status: "Sent",
      },
      {
        commId: "C-9002",
        subject: "API Latency Advisory",
        channel: "SMS",
        audience: "Developers",
        sentAt: "2025-08-16T09:15:00",
        status: "Queued",
      },
      {
        commId: "C-9003",
        subject: "Service Restoration Notice",
        channel: "Email",
        audience: "Retail Users",
        sentAt: "2025-08-15T18:42:00",
        status: "Sent",
      },
      {
        commId: "C-8999",
        subject: "Incident Update #2",
        channel: "Portal",
        audience: "All Customers",
        sentAt: "2025-08-15T14:05:00",
        status: "Draft",
      },
    ],
    searchKeys: ["commId", "subject", "channel", "audience"],
  },

  complaints: {
    title: "Customer Complaints",
    description:
      "Review complaint cases, categories, progress and SLA adherence.",
    idKey: "caseId",
    columns: [
      { key: "caseId", label: "Case ID" },
      { key: "category", label: "Category" },
      { key: "region", label: "Region" },
      { key: "submitted", label: "Submitted" },
      { key: "slaDue", label: "SLA Due" },
      { key: "status", label: "Status" },
    ],
    records: [
      {
        caseId: "CMP-3001",
        category: "Billing",
        region: "West",
        submitted: "2025-08-16T07:30:00",
        slaDue: "2025-08-19T07:30:00",
        status: "Open",
      },
      {
        caseId: "CMP-3002",
        category: "Service Quality",
        region: "Midwest",
        submitted: "2025-08-15T16:12:00",
        slaDue: "2025-08-18T16:12:00",
        status: "In Progress",
      },
      {
        caseId: "CMP-2998",
        category: "Onboarding",
        region: "Northeast",
        submitted: "2025-08-14T11:05:00",
        slaDue: "2025-08-17T11:05:00",
        status: "Resolved",
      },
      {
        caseId: "CMP-2995",
        category: "Security",
        region: "Southwest",
        submitted: "2025-08-13T09:40:00",
        slaDue: "2025-08-16T09:40:00",
        status: "Escalated",
      },
    ],
    searchKeys: ["caseId", "category", "region"],
    regionKey: "region",
    categoryKey: "category",
  },
};

// --- UTILITIES -------------------------------------------------------------

function formatDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function statusBadgeStyle(status: string) {
  const normalized = status.toLowerCase();
  if (["done", "resolved", "awarded"].includes(normalized))
    return "bg-green-100 text-green-700 border-green-200";
  if (["stage 1", "under review", "open", "draft", "queued"].includes(normalized))
    return "bg-blue-100 text-blue-700 border-blue-200";
  if (["shortlisted", "in progress"].includes(normalized))
    return "bg-amber-100 text-amber-700 border-amber-200";
  if (["rejected", "escalated"].includes(normalized))
    return "bg-red-100 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

// --- COMPONENT -------------------------------------------------------------

export function OutagesView() {
  const cfg = MODE_CONFIG[demoMode];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredRecords = useMemo(() => {
    let recs = [...cfg.records];

    // Search across defined keys
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      recs = recs.filter((r) =>
        cfg.searchKeys.some(
          (k) => String(r[k] ?? "").toLowerCase().includes(lower)
        )
      );
    }

    if (selectedId !== "all") {
      recs = recs.filter((r) => String(r[cfg.idKey]) === selectedId);
    }

    if (cfg.regionKey && selectedRegion !== "all") {
      recs = recs.filter(
        (r) =>
          String(r[cfg.regionKey!]).toLowerCase() ===
          selectedRegion.toLowerCase()
      );
    }

    if (cfg.categoryKey && selectedCategory !== "all") {
      recs = recs.filter(
        (r) =>
          String(r[cfg.categoryKey!]).toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    if (startDate) {
      const s = new Date(startDate).getTime();
      recs = recs.filter((r) => {
        const dateField =
          r.identified || r.submitted || r.sentAt || r.date || r.submitted;
        if (!dateField) return true;
        return new Date(dateField).getTime() >= s;
      });
    }
    if (endDate) {
      const e = new Date(endDate).getTime();
      recs = recs.filter((r) => {
        const dateField =
          r.identified || r.submitted || r.sentAt || r.date || r.submitted;
        if (!dateField) return true;
        return new Date(dateField).getTime() <= e;
      });
    }

    return recs;
  }, [
    cfg,
    searchTerm,
    selectedId,
    selectedRegion,
    selectedCategory,
    startDate,
    endDate,
  ]);

  const idOptions = useMemo(
    () => cfg.records.map((r) => String(r[cfg.idKey])),
    [cfg]
  );
  const regionOptions = useMemo(() => {
    if (!cfg.regionKey) return [];
    return Array.from(new Set(cfg.records.map((r) => r[cfg.regionKey!])));
  }, [cfg]);
  const categoryOptions = useMemo(() => {
    if (!cfg.categoryKey) return [];
    return Array.from(new Set(cfg.records.map((r) => r[cfg.categoryKey!])));
  }, [cfg]);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{cfg.title}</h1>
        <p className="text-gray-600 mb-4">{cfg.description}</p>
      </div>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-72 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />

            {/* ID Select */}
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="w-44 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="All IDs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All IDs</SelectItem>
                {idOptions.map((id) => (
                  <SelectItem key={id} value={id}>
                    {id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Region Select (if available) */}
            {cfg.regionKey && (
              <Select
                value={selectedRegion}
                onValueChange={setSelectedRegion}
              >
                <SelectTrigger className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regionOptions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Category Select (if available) */}
            {cfg.categoryKey && (
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button
              onClick={() => {
                // triggers recalculation since states already bound
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
            >
              Apply filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 border-b border-gray-200">
                {cfg.columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className="font-semibold text-gray-700 cursor-default"
                  >
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow
                  key={String(record[cfg.idKey])}
                  className="hover:bg-gray-50/50 border-b border-gray-100 cursor-default"
                >
                  {cfg.columns.map((col) => {
                    const value = record[col.key];
                    if (col.key === "comms") {
                      // Outage-specific link preserved
                      return (
                        <TableCell key={col.key}>
                          <Button
                            variant="link"
                            className="text-blue-600 hover:text-blue-700 p-0 font-medium cursor-pointer"
                          >
                            View comms record
                          </Button>
                        </TableCell>
                      );
                    }
                    if (col.key === "status") {
                      return (
                        <TableCell key={col.key}>
                          <Badge
                            variant="outline"
                            className={statusBadgeStyle(String(value || ""))}
                          >
                            {value}
                          </Badge>
                        </TableCell>
                      );
                    }
                    // Date-ish fields formatting
                    if (
                      ["identified", "submitted", "sentAt", "slaDue"].includes(
                        col.key
                      )
                    ) {
                      return (
                        <TableCell
                          key={col.key}
                          className="text-sm text-gray-600"
                        >
                          {formatDate(String(value))}
                        </TableCell>
                      );
                    }
                    if (col.key === "amount" && typeof value === "number") {
                      return (
                        <TableCell key={col.key} className="text-gray-700">
                          {value.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          })}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        key={col.key}
                        className={
                          col.key === cfg.idKey
                            ? "font-medium text-gray-900"
                            : "text-gray-700"
                        }
                      >
                        {String(value ?? "")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="py-2">
        <p className="text-sm text-gray-600">
          {filteredRecords.length} of {cfg.records.length} results
        </p>
        <p className="text-xs text-gray-500">
          Mode: {demoMode} (change via NEXT_PUBLIC_DEMO_MODE then restart dev
          server)
        </p>
      </div>
    </div>
  );
}
