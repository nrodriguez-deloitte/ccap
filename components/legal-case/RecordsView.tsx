"use client";

import { useState, useRef } from "react";
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

const outageData = [
  {
    id: "INC20485",
    type: "Major",
    location: "NYC",
    date: "19:00 01/02/2025",
    consumers: "90,000",
  },
  {
    id: "INC20486",
    type: "Minor",
    location: "LA",
    date: "20:00 01/02/2025",
    consumers: "12,000",
  },
  {
    id: "INC20487",
    type: "Major",
    location: "NYC",
    date: "22:00 01/02/2025",
    consumers: "145,000",
  },
  {
    id: "INC20488",
    type: "Minor",
    location: "LA",
    date: "23:30 01/02/2025",
    consumers: "18,000",
  },
  {
    id: "INC20489",
    type: "Major",
    location: "NYC",
    date: "07:45 02/02/2025",
    consumers: "210,000",
  },
  {
    id: "INC20490",
    type: "Minor",
    location: "LA",
    date: "09:10 02/02/2025",
    consumers: "9,500",
  },
];

const stageData = [
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

export function RecordsView() {
  const [selectedOutage, setSelectedOutage] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleViewClick = (outageId: string) => {
    setSelectedOutage(outageId);
    setShowDetails(true);
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const itemsPerPage = 5;
  const totalItems = outageData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedOutages = outageData.slice(startIndex, endIndex);
  const displayStart = startIndex + 1;
  const displayEnd = Math.min(endIndex, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setShowDetails(false);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setShowDetails(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Title and Description Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Comms Records</h1>
        <p className="text-gray-600">
          View stage-wise communication records for outages. Select an outage to
          see details.
        </p>
      </div>

      {/* Filter Section */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              placeholder="Search by outage, location..."
              className="w-64 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              placeholder="Filter by outage ID..."
              className="w-48 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Select defaultValue="all-outages">
              <SelectTrigger className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-outages">All Outages</SelectItem>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-locations">
              <SelectTrigger className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-locations">All Locations</SelectItem>
                <SelectItem value="nyc">NYC</SelectItem>
                <SelectItem value="la">LA</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              defaultValue="2025-02-01"
            />
            <Input
              type="date"
              className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              defaultValue="2025-02-02"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer">
              Apply filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700 cursor-default">
                  Outage ID
                </TableHead>
                <TableHead className="font-semibold text-gray-700 cursor-default">
                  Type
                </TableHead>
                <TableHead className="font-semibold text-gray-700 cursor-default">
                  Location
                </TableHead>
                <TableHead className="font-semibold text-gray-700 cursor-default">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-gray-700 cursor-default">
                  Consumers
                </TableHead>
                <TableHead className="font-semibold text-gray-700 cursor-default"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedOutages.map((outage) => (
                <TableRow
                  key={outage.id}
                  className="hover:bg-gray-50/50 border-b border-gray-100 cursor-default">
                  <TableCell className="font-medium text-gray-900">
                    {outage.id}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        outage.type === "Major" ? "destructive" : "secondary"
                      }
                      className={
                        outage.type === "Major"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }>
                      {outage.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {outage.location}
                  </TableCell>
                  <TableCell className="text-gray-700">{outage.date}</TableCell>
                  <TableCell className="text-gray-700">
                    {outage.consumers}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="text-blue-600 hover:text-blue-700 p-0 font-medium cursor-pointer"
                      onClick={() => handleViewClick(outage.id)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {displayStart}–{displayEnd} of {totalItems}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                className={
                  currentPage === 1
                    ? "text-gray-400 bg-white border-gray-200 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50 bg-white border-gray-200 hover:border-gray-300 cursor-pointer"
                }
                onClick={handlePrevious}>
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "text-gray-400 bg-white border-gray-200 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50 bg-white border-gray-200 hover:border-gray-300 cursor-pointer"
                }
                onClick={handleNext}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Section */}
      {showDetails && selectedOutage && (
        <Card
          ref={detailsRef}
          className="bg-white shadow-sm border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 cursor-pointer">
                Details
              </Button>
            </div>

            <div className="px-6 py-4 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Comms record for Outage {selectedOutage}
                </h3>
                <p className="text-gray-500">Last updated 2:06 pm</p>
              </div>

              {/* Stage Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stageData.map((stage, index) => (
                  <div key={index} className="space-y-4">
                    {/* Stage Header */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          stage.status === "complete"
                            ? "bg-green-500 border-green-500"
                            : stage.status === "current"
                            ? "bg-orange-400 border-orange-400"
                            : "bg-gray-200 border-gray-300"
                        }`}>
                        {stage.status === "complete" && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {stage.stage}
                        </h4>
                        <p className="text-sm text-gray-500">{stage.time}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {stage.percentage}
                        </span>
                        <span className="text-gray-500">{stage.consumers}</span>
                      </div>
                    </div>

                    {/* Communications */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">
                        Comms compliance
                      </h5>
                      {stage.comms.map((comm, commIndex) => (
                        <div
                          key={commIndex}
                          className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {comm.type}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm ${
                                comm.status === "Exceed"
                                  ? "text-orange-600"
                                  : "text-gray-500"
                              }`}>
                              {comm.status}
                            </span>
                            {comm.icon === "check" && (
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                            )}
                            {comm.icon === "warning" && (
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
