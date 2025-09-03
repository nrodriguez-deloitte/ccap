"use client";

import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search } from "lucide-react";

export function ContentAuthoring() {
  const [selectedOutage, setSelectedOutage] = useState("INC20485");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedDraft, setGeneratedDraft] = useState("");
  const [channel, setChannel] = useState("Email");

  const outages = [
    {
      id: "INC20485",
      stage: "STAGE 1",
      customers: "90,000 customers",
      customersCount: 90000,
      location: "NYC",
      type: "Major outage",
      identified: "19:00 01/02/2025",
    },
    {
      id: "INC20486",
      stage: "STAGE 1",
      customers: "12,000 customers",
      customersCount: 12000,
      location: "LA",
      type: "Minor outage",
      identified: "20:00 01/02/2025",
    },
    {
      id: "INC20487",
      stage: "STAGE 1",
      customers: "145,000 customers",
      customersCount: 145000,
      location: "NYC",
      type: "Major outage",
      identified: "22:00 01/02/2025",
    },
    {
      id: "INC20488",
      stage: "STAGE 1",
      customers: "18,000 customers",
      customersCount: 18000,
      location: "LA",
      type: "Minor outage",
      identified: "23:30 01/02/2025",
    },
  ];

  const templates = [
    {
      name: "Initial Outage Notification (Email)",
      id: "TPL-001",
      variables: ["outageId", "location", "consumers"],
      type: "Email",
      preview: {
        Email: `Subject: Service Outage Notification – {outageId}

Dear Valued Customer,

We are currently experiencing a service outage in the {location} area affecting approximately {consumers} customers.

Regards,
Customer Service Team`,
      },
    },
    {
      name: "SMS Alert - Service Interruption",
      id: "TPL-002",
      variables: ["location", "consumers", "outageId"],
      type: "SMS",
      preview: {
        SMS: `SERVICE ALERT: We're experiencing an outage in {location} affecting ~{consumers} customers. Ref: {outageId}`,
      },
    },
    {
      name: "Website Banner Notification",
      id: "TPL-003",
      variables: ["location", "outageId"],
      type: "Website",
      preview: {
        Website: `SERVICE UPDATE: We are currently experiencing service issues in {location}. Incident: {outageId}`,
      },
    },
  ];

  const filteredOutages = outages.filter(
    (outage) =>
      outage.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outage.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outage.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentOutage = () => {
    return outages.find((outage) => outage.id === selectedOutage);
  };

  const getCurrentTemplate = () => {
    return templates.find((template) => template.id === selectedTemplate);
  };

  const populateTemplate = (templateText: string, outage: any) => {
    return templateText
      .replace(/{outageId}/g, outage.id)
      .replace(/{location}/g, outage.location)
      .replace(/{consumers}/g, outage.customersCount.toLocaleString());
  };

  const handleGenerateDraft = () => {
    const template = getCurrentTemplate();
    const outage = getCurrentOutage();

    if (template && outage) {
      const templateText =
        template.preview[channel as keyof typeof template.preview] ||
        template.preview[template.type as keyof typeof template.preview];
      const populatedText = populateTemplate(templateText, outage);
      setGeneratedDraft(populatedText);
      setCurrentStep(3);
    }
  };

  const getWordCount = (text: string) => {
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const characters = text.length;
    return { words, characters };
  };

  const getGeneratedDescription = () => {
    const template = getCurrentTemplate();
    const outage = getCurrentOutage();
    if (template && outage) {
      return `Generated from ${template.id} for ${outage.id} (Channel: ${channel})`;
    }
    return "";
  };

  const steps = [
    { number: 1, title: "Select Outage & Template", active: currentStep >= 1 },
    { number: 2, title: "Generate Draft", active: currentStep >= 2 },
    { number: 3, title: "Review Draft", active: currentStep >= 3 },
    { number: 4, title: "Submit Comms", active: currentStep >= 4 },
  ];

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Outage Communication Management
          </h1>
          <p className="text-gray-600 mt-1">
            Select an outage, choose a template, generate and submit
            communications.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center space-x-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium cursor-pointer ${
                  step.active
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-500"
                }`}>
                {step.number}
              </div>
              <span
                className={`ml-2 text-sm font-medium cursor-pointer ${
                  step.active ? "text-gray-900" : "text-gray-500"
                }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Guidelines:</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Ensure all customer impact details are accurate
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Include timeline and next steps
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Use clear, concise language
            </li>
          </ul>
        </div>
      </div>

      <div className="px-6 grid grid-cols-4 gap-6">
        {/* Column 1 - Select Outage */}
        <div className="col-span-1">
          <Card className="border border-gray-200">
            <CardContent className="py-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Outage
              </h3>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by outage, location or cause..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 cursor-pointer"
                />
              </div>

              {/* Outage List */}
              <div className="space-y-3">
                {filteredOutages.map((outage) => (
                  <div
                    key={outage.id}
                    onClick={() => setSelectedOutage(outage.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedOutage === outage.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">
                          {outage.id}
                        </span>
                        <span className="text-sm text-gray-500">
                          {outage.stage}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {outage.customers}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {outage.location}
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge
                        variant={
                          outage.type.includes("Major")
                            ? "destructive"
                            : "secondary"
                        }
                        className="cursor-pointer">
                        {outage.type}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        Identified: {outage.identified}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 2 - Communication Templates */}
        <div className="col-span-1">
          <Card className="border border-gray-200">
            <CardContent className="py-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Communication Templates
              </h3>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <div className="font-medium text-gray-900 text-sm">
                      {template.name}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs text-gray-500">
                        {template.id} • Variables: {template.variables.length}
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs cursor-pointer">
                        {template.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 3 - Template Preview */}
        <div className="col-span-1">
          <Card className="border border-gray-200">
            <CardContent className="py-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {getCurrentTemplate()?.name || "Initial Outage Notification"}
                </h3>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger className="w-32 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email" className="cursor-pointer">
                      Email
                    </SelectItem>
                    <SelectItem value="SMS" className="cursor-pointer">
                      SMS
                    </SelectItem>
                    <SelectItem value="Website" className="cursor-pointer">
                      Website
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Template Variables:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getCurrentTemplate()?.variables.map((variable) => (
                      <Badge
                        key={variable}
                        variant="outline"
                        className="text-xs">
                        {variable}
                      </Badge>
                    )) || (
                      <span className="text-sm text-gray-500">
                        Select a template
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Preview:</h4>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded whitespace-pre-line">
                    {(() => {
                      if (
                        !selectedTemplate ||
                        !getCurrentTemplate() ||
                        !getCurrentOutage()
                      ) {
                        return "Select a template to preview its content with outage data.";
                      }

                      const template = getCurrentTemplate()!;
                      const outage = getCurrentOutage()!;
                      const templateText =
                        template.preview[
                          channel as keyof typeof template.preview
                        ] ||
                        template.preview[
                          template.type as keyof typeof template.preview
                        ];
                      const populatedText = populateTemplate(
                        templateText,
                        outage
                      );

                      return (
                        <>
                          {populatedText}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <span className="text-xs text-gray-500">
                              • Preview populated with selected outage data
                            </span>
                          </div>
                          <div className="mt-1">
                            <span className="text-xs text-green-600 font-medium">
                              Ready to generate: Template and outage data are
                              selected.
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <Button
                  onClick={handleGenerateDraft}
                  disabled={!selectedTemplate}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer disabled:cursor-not-allowed">
                  Generate Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 4 - Generated Communication Draft */}
        <div className="col-span-1">
          <Card className="border border-gray-200">
            <CardContent className="py-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Generated Communication Draft
                </h3>
                {generatedDraft && (
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600">
                      Generated
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {getWordCount(generatedDraft).words} words •{" "}
                      {getWordCount(generatedDraft).characters} characters
                    </span>
                  </div>
                )}
              </div>

              {generatedDraft ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-2">
                    {getGeneratedDescription()}
                  </div>
                  <Textarea
                    value={generatedDraft}
                    onChange={(e) => setGeneratedDraft(e.target.value)}
                    className="min-h-[200px] cursor-pointer"
                    placeholder="Generated content will appear here..."
                  />
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="cursor-pointer bg-transparent">
                      Save draft
                    </Button>
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white cursor-pointer">
                      Submit for Approval
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  No draft generated
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
