// Central demo configuration. Adjust NEXT_PUBLIC_DEMO_MODE at startup to switch datasets
// Supported modes: outages | bids | communications | complaints
export type DemoMode = "outages" | "bids" | "communications" | "complaints";

export interface MapItem {
  id: string;
  title: string;
  lat: number;
  lng: number;
  primaryMetric: number; // Main numeric metric for scaling marker/circle
  category: string; // Used for filtering
  label?: string; // Small badge / stage / status label
  severity?: string; // For color logic (legacy outage support)
  meta?: Record<string, any>; // Arbitrary extra fields
}

export interface MapDataset {
  title: string;
  subtitle?: string;
  items: MapItem[];
  stats: { label: string; value: string }[];
  filters: { id: string; label: string; count: number }[];
  markerColor: (item: MapItem) => string;
  circleRadius: (item: MapItem) => number; // return 0 for none
}

export const demoMode: DemoMode = (process.env.NEXT_PUBLIC_DEMO_MODE as DemoMode) || "outages";

// --- DATASET BUILDERS -----------------------------------------------------

const outagesDataset = (): MapDataset => {
  const items: MapItem[] = [
    { id: "sydney-outage-3", title: "Sydney Outage 3", lat: -33.8688, lng: 151.2093, primaryMetric: 10000, category: "significant", label: "Stage 1", severity: "Significant" },
    { id: "network-connectivity", title: "Network connectivity issue in Sydney CBD area", lat: -33.865, lng: 151.2094, primaryMetric: 5000, category: "major", label: "Stage 1", severity: "Major" },
    { id: "sydney-outage", title: "Sydney Outage", lat: -33.87, lng: 151.21, primaryMetric: 0, category: "significant", label: "Stage 1", severity: "Significant" },
  ];
  const stats = [
    { label: "Total outage incidents", value: String(items.length) },
    { label: "Services impacted", value: items.reduce((a, c) => a + c.primaryMetric, 0).toLocaleString() },
    { label: "Current unplanned outages", value: items.filter(i => i.primaryMetric > 0).length.toString() },
    { label: "Compliance risk", value: "52" },
  ];
  const filtersBase = [
    { id: "all", label: "All unplanned ACMA outages" },
    { id: "major", label: "Major" },
    { id: "significant", label: "Significant" },
  ];
  const filters = filtersBase.map(f => ({ ...f, count: f.id === "all" ? items.length : items.filter(i => i.category === f.id).length }));
  return {
    title: "Current unplanned outages",
    subtitle: "Last updated recently",
    items,
    stats,
    filters,
    markerColor: (item) => (item.severity === "Major" ? "#ef4444" : item.severity === "Significant" ? "#f59e0b" : "#10b981"),
    circleRadius: (item) => (item.primaryMetric > 0 ? item.primaryMetric * 10 : 0),
  };
};

const bidsDataset = (): MapDataset => {
  const items: MapItem[] = [
    { id: "bid-ny", title: "Broadband Expansion - NY", lat: 40.7128, lng: -74.006, primaryMetric: 25_000_000, category: "in-review", label: "In Review" },
    { id: "bid-ca", title: "Rural Connectivity - CA", lat: 36.7783, lng: -119.4179, primaryMetric: 40_000_000, category: "submitted", label: "Submitted" },
    { id: "bid-tx", title: "Fiber Backbone - TX", lat: 31.9686, lng: -99.9018, primaryMetric: 15_000_000, category: "awarded", label: "Awarded" },
    { id: "bid-fl", title: "Resilience Upgrade - FL", lat: 27.6648, lng: -81.5158, primaryMetric: 8_500_000, category: "draft", label: "Draft" },
  ];
  const totalValue = items.reduce((a, c) => a + c.primaryMetric, 0);
  const stats = [
    { label: "Active bids", value: String(items.length) },
    { label: "Total value (USD)", value: `$${(totalValue / 1_000_000).toFixed(1)}M` },
    { label: "Awarded", value: items.filter(i => i.category === "awarded").length.toString() },
    { label: "In Review", value: items.filter(i => i.category === "in-review").length.toString() },
  ];
  const filterIds = ["all", "draft", "submitted", "in-review", "awarded"] as const;
  const filters = filterIds.map(id => ({ id, label: id === "all" ? "All bids" : id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()), count: id === "all" ? items.length : items.filter(i => i.category === id).length }));
  return {
    title: "Nationwide bid submissions",
    subtitle: "Aggregated federal funding proposals",
    items,
    stats,
    filters,
    markerColor: (item) => {
      switch (item.category) {
        case "awarded": return "#16a34a";
        case "in-review": return "#f59e0b";
        case "submitted": return "#3b82f6";
        case "draft": return "#6b7280";
        default: return "#0ea5e9";
      }
    },
    circleRadius: (item) => Math.sqrt(item.primaryMetric) * 10, // scale value
  };
};

const communicationsDataset = (): MapDataset => {
  const items: MapItem[] = [
    { id: "comm-east", title: "Eastern Region Updates", lat: 38.8977, lng: -77.0365, primaryMetric: 320, category: "active", label: "Active" },
    { id: "comm-mid", title: "Midwest Stakeholder Briefings", lat: 41.8781, lng: -87.6298, primaryMetric: 150, category: "draft", label: "Draft" },
    { id: "comm-west", title: "Western Public Notices", lat: 34.0522, lng: -118.2437, primaryMetric: 90, category: "archived", label: "Archived" },
  ];
  const stats = [
    { label: "Active campaigns", value: items.filter(i => i.category === "active").length.toString() },
    { label: "Drafts", value: items.filter(i => i.category === "draft").length.toString() },
    { label: "Archived", value: items.filter(i => i.category === "archived").length.toString() },
    { label: "Total messages", value: items.reduce((a, c) => a + c.primaryMetric, 0).toString() },
  ];
  const filters = ["all", "active", "draft", "archived"].map(id => ({ id, label: id === "all" ? "All communications" : id.charAt(0).toUpperCase() + id.slice(1), count: id === "all" ? items.length : items.filter(i => i.category === id).length }));
  return {
    title: "Regional communications overview",
    subtitle: "Live & historical messaging activity",
    items,
    stats,
    filters,
    markerColor: (item) => item.category === "active" ? "#2563eb" : item.category === "draft" ? "#9ca3af" : "#4b5563",
    circleRadius: (item) => item.primaryMetric * 50, // scaled small numbers
  };
};

const complaintsDataset = (): MapDataset => {
  const items: MapItem[] = [
    { id: "compl-ny", title: "NY Service Complaints", lat: 42.6526, lng: -73.7562, primaryMetric: 420, category: "high", label: "High" },
    { id: "compl-ca", title: "CA Service Complaints", lat: 36.7783, lng: -119.4179, primaryMetric: 310, category: "medium", label: "Medium" },
    { id: "compl-tx", title: "TX Service Complaints", lat: 31.9686, lng: -99.9018, primaryMetric: 120, category: "low", label: "Low" },
  ];
  const stats = [
    { label: "Total complaints", value: items.reduce((a, c) => a + c.primaryMetric, 0).toString() },
    { label: "High severity regions", value: items.filter(i => i.category === "high").length.toString() },
    { label: "Medium", value: items.filter(i => i.category === "medium").length.toString() },
    { label: "Low", value: items.filter(i => i.category === "low").length.toString() },
  ];
  const filters = ["all", "high", "medium", "low"].map(id => ({ id, label: id === "all" ? "All complaints" : id.charAt(0).toUpperCase() + id.slice(1), count: id === "all" ? items.length : items.filter(i => i.category === id).length }));
  return {
    title: "Complaint density by region",
    subtitle: "Volume & severity hotspots",
    items,
    stats,
    filters,
    markerColor: (item) => item.category === "high" ? "#dc2626" : item.category === "medium" ? "#f59e0b" : "#16a34a",
    circleRadius: (item) => item.primaryMetric * 100, // higher weight
  };
};

export function getMapDataset(mode: DemoMode = demoMode): MapDataset {
  switch (mode) {
    case "bids":
      return bidsDataset();
    case "communications":
      return communicationsDataset();
    case "complaints":
      return complaintsDataset();
    case "outages":
    default:
      return outagesDataset();
  }
}
