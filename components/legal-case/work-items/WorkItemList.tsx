"use client";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Clock, AlertTriangle, FileText, MessageSquare } from "lucide-react";

export interface WorkItem {
  id: string;
  type: "complaint" | "outage" | "bid" | "comms";
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "resolved" | "pending";
  createdAt: string;
  assignee?: string;
  location?: string;
}

interface WorkItemListProps {
  workItems: WorkItem[];
  onItemClick: (item: WorkItem) => void;
  selectedItemId?: string;
}

const typeIcons = {
  complaint: AlertTriangle,
  outage: Clock,
  bid: FileText,
  comms: MessageSquare,
};

const typeColors: Record<string,string> = {
  complaint: "bg-red-100 text-red-700",
  outage: "bg-orange-100 text-orange-700",
  bid: "bg-blue-100 text-blue-700",
  comms: "bg-green-100 text-green-700",
};

const priorityColors: Record<string,string> = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const statusColors: Record<string,string> = {
  open: "bg-blue-100 text-blue-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  pending: "bg-gray-100 text-gray-700",
};

export function WorkItemList({ workItems, onItemClick, selectedItemId }: WorkItemListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Work Items</h3>
      <div className="space-y-2">
        {workItems.map((item) => {
          const Icon = typeIcons[item.type];
          const isSelected = selectedItemId === item.id;
          return (
            <Card
              key={item.id}
              className={`cursor-pointer transition-all hover:shadow-sm ${isSelected ? "ring-2 ring-blue-500 shadow-sm" : ""}`}
              onClick={() => onItemClick(item)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Icon className="h-3 w-3 flex-shrink-0" />
                    <h4 className="text-sm truncate font-medium">{item.title}</h4>
                  </div>
                  <Badge className={`${typeColors[item.type]} text-xs`}>{item.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={`${priorityColors[item.priority]} text-xs`}>{item.priority}</Badge>
                  <Badge className={`${statusColors[item.status]} text-xs`} variant="outline">{item.status}</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                  <span>{item.createdAt}</span>
                  {item.assignee && <span className="truncate ml-2">{item.assignee}</span>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
