"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Search } from "lucide-react"

interface Template {
  id: string
  name: string
  type: string
  lastUpdated: string
  status: string
  editRequest: string | null
  version: string
  actionType: "request" | "locked"
}

const templatesData: Template[] = [
  {
    id: "1",
    name: "B2B Customer Notification",
    type: "Email",
    lastUpdated: "2025-08-19 14:32",
    status: "Published",
    editRequest: null,
    version: "v3.2",
    actionType: "request",
  },
  {
    id: "2",
    name: "Crisis Outage Alert",
    type: "Confluence Page",
    lastUpdated: "2025-08-18 09:15",
    status: "Published",
    editRequest: "Edit Pending (REQ-1045)",
    version: "v2.7",
    actionType: "locked",
  },
  {
    id: "3",
    name: "General Notification",
    type: "Email",
    lastUpdated: "2025-08-17 11:00",
    status: "Published",
    editRequest: null,
    version: "v1.9",
    actionType: "request",
  },
]

export function TemplatesView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editRequestFilter, setEditRequestFilter] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template)
    setIsModalOpen(true)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Templates Management</h1>
          <p className="text-gray-600">Manage notification and outage templates. Submit edit requests for approval.</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by template name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="confluence">Confluence Page</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={editRequestFilter} onValueChange={setEditRequestFilter}>
              <SelectTrigger className="w-[160px] border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="All Edit Requests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Edit Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 cursor-pointer">Apply filters</Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Template Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Last Updated</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Edit Request</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Version</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {templatesData.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTemplateClick(template)}
                          className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                        >
                          {template.name}
                        </button>
                        {template.name === "Crisis Outage Alert" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help inline-flex items-center">
                                <span className="text-gray-600" style={{ fontSize: "10px", fontWeight: "bold" }}>
                                  (4)
                                </span>
                                <span className="text-red-500">*</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>No. of deviations from original template</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{template.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{template.lastUpdated}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                        {template.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{template.editRequest || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{template.version}</td>
                    <td className="px-6 py-4">
                      {template.actionType === "request" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer bg-transparent"
                        >
                          Request Edit
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="border-gray-300 text-gray-400 cursor-not-allowed bg-transparent"
                        >
                          Edit Locked
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500">* No. of deviations from original template</p>
          </div>
        </div>

        {/* Modal for template details */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" aria-hidden="true" />
            <div className="relative bg-white rounded-lg shadow-lg p-6">
              <DialogHeader>
                <DialogTitle>Template Details</DialogTitle>
              </DialogHeader>
              {selectedTemplate && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Template Name</label>
                      <p className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</p>
                    </div>
                    <div className="text-right">
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <div className="mt-1">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          {selectedTemplate.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Type</label>
                      <p className="text-gray-900">{selectedTemplate.type}</p>
                    </div>
                    <div className="text-right">
                      <label className="text-sm font-medium text-gray-600">Last Updated</label>
                      <p className="text-gray-900">{selectedTemplate.lastUpdated}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">Template Content</label>
                    <Textarea
                      readOnly
                      value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                      className="min-h-[200px] resize-none bg-gray-50 cursor-default font-mono border border-gray-300 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
