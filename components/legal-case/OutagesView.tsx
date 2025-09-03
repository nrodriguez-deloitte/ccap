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
    <div className="bg-gray-50 min-h-screen">
      <div className="px-6">
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Outage Communication Records</h1>
        <p className="text-gray-600 mt-1 mb-4">
          Filter, find and extract notification records sent to customers during an outage
        </p>
      </div>

      <div className="px-6">
        <Card>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search by outage, location or cause..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <Select value={selectedOutage} onValueChange={setSelectedOutage}>
                <SelectTrigger className="w-[180px]">
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
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="sydney">Sydney</SelectItem>
                  <SelectItem value="melbourne">Melbourne</SelectItem>
                  <SelectItem value="brisbane">Brisbane</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-[140px]"
                />
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-[140px]" />
              </div>

              <Button onClick={handleSearch} className="bg-gray-900 hover:bg-gray-800 text-white px-6">
                Apply filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 py-4">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Incident</TableHead>
                  <TableHead className="font-semibold text-gray-700">Region</TableHead>
                  <TableHead className="font-semibold text-gray-700">ACMA</TableHead>
                  <TableHead className="font-semibold text-gray-700">Cause of outage</TableHead>
                  <TableHead className="font-semibold text-gray-700">Comms records</TableHead>
                  <TableHead className="font-semibold text-gray-700">Identified</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record, index) => (
                  <TableRow key={record.incident} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{record.incident}</TableCell>
                    <TableCell>{record.region}</TableCell>
                    <TableCell>{record.acma}</TableCell>
                    <TableCell>{record.cause}</TableCell>
                    <TableCell>
                      <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal">
                        View comms record
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{record.identified}</TableCell>
                    <TableCell>
                      <Badge
                        variant={record.status === "Done" ? "secondary" : "default"}
                        className={
                          record.status === "Done" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
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
      </div>

      <div className="px-6 py-4">
        <p className="text-sm text-gray-600">
          {filteredRecords.length} of {outageRecords.length} results selected
        </p>
      </div>
    </div>
  )
}
