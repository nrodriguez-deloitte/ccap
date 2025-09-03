"use client"

import { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

const outageRecords = [
  {
    incident: "NO-500",
    region: "Sydney Outage 3",
    acma: "SignalPoint Local Outage (Regional)",
    cause: "Sydney Outage 3",
    identified: "16/08/2025 21:59:00",
    status: "STAGE 1",
  },
  {
    incident: "NO-508",
    region: "Network connectivity issue in Sydney CBD area",
    acma: "Major outage",
    cause: "Network connectivity issue in Sydney CBD area",
    identified: "16/08/2025 21:58:43",
    status: "STAGE 1",
  },
  {
    incident: "NO-501",
    region: "Sydney Outage",
    acma: "SignalPoint Local Outage (Regional)",
    cause: "Sydney Outage",
    identified: "16/08/2025 19:07:04",
    status: "STAGE 1",
  },
  {
    incident: "NO-499",
    region: "INC10 - Major Outage",
    acma: "Major outage",
    cause: "INC10 - Major Outage",
    identified: "14/08/2025 14:47:07",
    status: "Done",
  },
  {
    incident: "NO-498",
    region: "INC1 - Major Outage",
    acma: "Major outage",
    cause: "INC1 - Major Outage",
    identified: "14/08/2025 14:47:06",
    status: "Done",
  },
  {
    incident: "NO-497",
    region: "INC23445 - Major Outage",
    acma: "Major outage",
    cause: "INC23445 - Major Outage",
    identified: "11/08/2025 11:30:21",
    status: "STAGE 1",
  },
  {
    incident: "NO-496",
    region: "INC2344 - Major Outage",
    acma: "Major outage",
    cause: "INC2344 - Major Outage",
    identified: "11/08/2025 11:27:31",
    status: "STAGE 1",
  },
  {
    incident: "NO-495",
    region: "INC2134 - Major Outage",
    acma: "Major outage",
    cause: "INC2134 - Major Outage",
    identified: "11/08/2025 11:16:31",
    status: "STAGE 1",
  },
]

export function OutagesView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOutage, setSelectedOutage] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [filteredRecords, setFilteredRecords] = useState(outageRecords)

  const handleSearch = () => {
    let filtered = outageRecords

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.incident.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.cause.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedOutage !== "all") {
      filtered = filtered.filter((record) => record.incident === selectedOutage)
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter((record) => record.region.toLowerCase().includes(selectedLocation.toLowerCase()))
    }

    setFilteredRecords(filtered)
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="space-y-2 mt-4">
        <h1 className="text-3xl font-bold text-gray-900">Outage Communication Records</h1>
        <p className="text-gray-600 mb-4">
          Filter, find and extract notification records sent to customers during an outage
        </p>
      </div>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              placeholder="Search by outage, location or cause..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-80 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Select value={selectedOutage} onValueChange={setSelectedOutage}>
              <SelectTrigger className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Filter by outage ID..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outages</SelectItem>
                {outageRecords.map((record) => (
                  <SelectItem key={record.incident} value={record.incident}>
                    {record.incident}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-40 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="sydney">Sydney</SelectItem>
                <SelectItem value="melbourne">Melbourne</SelectItem>
                <SelectItem value="brisbane">Brisbane</SelectItem>
              </SelectContent>
            </Select>
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
              onClick={handleSearch}
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
                <TableHead className="font-semibold text-gray-700 cursor-default">Incident</TableHead>
                <TableHead className="font-semibold text-gray-700 cursor-default">Region</TableHead>
                <TableHead className="font-semibold text-gray-700 cursor-default">ACMA</TableHead>
                <TableHead className="font-semibold text-gray-700 cursor-default">Cause of outage</TableHead>
                <TableHead className="font-semibold text-gray-700 cursor-default">Comms records</TableHead>
                <TableHead className="font-semibold text-gray-700 cursor-default">Identified</TableHead>
                <TableHead className="font-semibold text-gray-700 cursor-default">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record, index) => (
                <TableRow key={record.incident} className="hover:bg-gray-50/50 border-b border-gray-100 cursor-default">
                  <TableCell className="font-medium text-gray-900">{record.incident}</TableCell>
                  <TableCell className="text-gray-700">{record.region}</TableCell>
                  <TableCell className="text-gray-700">{record.acma}</TableCell>
                  <TableCell className="text-gray-700">{record.cause}</TableCell>
                  <TableCell>
                    <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 font-medium cursor-pointer">
                      View comms record
                    </Button>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{record.identified}</TableCell>
                  <TableCell>
                    <Badge
                      variant={record.status === "Done" ? "secondary" : "default"}
                      className={
                        record.status === "Done"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="py-4">
        <p className="text-sm text-gray-600">
          {filteredRecords.length} of {outageRecords.length} results selected
        </p>
      </div>
    </div>
  )
}
