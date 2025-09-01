import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Search, Plus, BookOpen, Scale, FileText, Quote, Save, Send } from "lucide-react";

interface Citation {
  id: string;
  source: string;
  type: "precedent" | "legislation" | "policy";
  reference: string;
  relevance: number;
}

interface PrecedentItem {
  id: string;
  title: string;
  court: string;
  year: string;
  relevance: number;
  summary: string;
}

const mockCitations: Citation[] = [
  {
    id: "1",
    source: "Employment Rights Act 1996",
    type: "legislation",
    reference: "Section 94",
    relevance: 95
  },
  {
    id: "2", 
    source: "Smith v. Jones Ltd",
    type: "precedent",
    reference: "[2023] EWCA Civ 123",
    relevance: 88
  },
  {
    id: "3",
    source: "Company HR Policy Manual",
    type: "policy", 
    reference: "Section 4.2.1",
    relevance: 76
  }
];

const mockPrecedents: PrecedentItem[] = [
  {
    id: "1",
    title: "Smith v. Jones Ltd",
    court: "Court of Appeal",
    year: "2023",
    relevance: 88,
    summary: "Established precedent for constructive dismissal in cases involving fundamental changes to employment terms..."
  },
  {
    id: "2",
    title: "Brown v. Tech Corp",
    court: "Employment Tribunal",
    year: "2024",
    relevance: 82,
    summary: "Ruling on reasonable adjustments for remote working arrangements under disability discrimination law..."
  },
  {
    id: "3",
    title: "Wilson v. Financial Services Ltd",
    court: "High Court",
    year: "2023",
    relevance: 75,
    summary: "Interpretation of garden leave clauses and their enforceability in senior executive contracts..."
  }
];

export function ContentAuthoring() {
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCitations, setSelectedCitations] = useState<Citation[]>([]);
  const [reasoning, setReasoning] = useState("");

  const addCitation = (citation: Citation) => {
    if (!selectedCitations.find(c => c.id === citation.id)) {
      setSelectedCitations([...selectedCitations, citation]);
    }
  };

  const removeCitation = (citationId: string) => {
    setSelectedCitations(selectedCitations.filter(c => c.id !== citationId));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "precedent": return "bg-blue-100 text-blue-800";
      case "legislation": return "bg-green-100 text-green-800";
      case "policy": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Communication Creator</h1>
        <p className="text-muted-foreground">
          Draft and finalize communications with AI assistance, templates, and citation tracking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2>Document Editor</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Submit for Review
                  </Button>
                </div>
              </div>
              
              <Textarea
                placeholder="Begin drafting your legal content here. Use AI suggestions and precedent libraries to enhance your work..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] resize-none"
              />
              
              {/* Citations Bar */}
              {selectedCitations.length > 0 && (
                <div className="space-y-2">
                  <h4>Selected Citations</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCitations.map((citation) => (
                      <Badge 
                        key={citation.id}
                        className={`${getTypeColor(citation.type)} cursor-pointer hover:opacity-80`}
                        onClick={() => removeCitation(citation.id)}
                      >
                        {citation.source} - {citation.reference} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Reasoning Section */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3>Legal Reasoning & Audit Trail</h3>
              <Textarea
                placeholder="Document your legal reasoning, analysis, and decision-making process for audit purposes..."
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                className="min-h-[150px] resize-none"
              />
            </div>
          </Card>
        </div>

        {/* Research Panel */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <Input
                  placeholder="Search precedents, legislation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <Tabs defaultValue="precedents" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="precedents">
                  <Scale className="h-4 w-4 mr-1" />
                  Cases
                </TabsTrigger>
                <TabsTrigger value="legislation">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Law
                </TabsTrigger>
                <TabsTrigger value="policies">
                  <FileText className="h-4 w-4 mr-1" />
                  Policy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="precedents" className="mt-4">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {mockPrecedents.map((precedent) => (
                      <div key={precedent.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{precedent.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {precedent.court} ({precedent.year})
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {precedent.relevance}% match
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {precedent.summary}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => addCitation({
                            id: precedent.id,
                            source: precedent.title,
                            type: "precedent",
                            reference: `[${precedent.year}]`,
                            relevance: precedent.relevance
                          })}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Cite
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="legislation" className="mt-4">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50">
                      <h4 className="font-medium text-sm">Employment Rights Act 1996</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Section 94: The right not to be unfairly dismissed
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => addCitation({
                          id: "leg1",
                          source: "Employment Rights Act 1996",
                          type: "legislation",
                          reference: "Section 94",
                          relevance: 95
                        })}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Cite
                      </Button>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50">
                      <h4 className="font-medium text-sm">Equality Act 2010</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Section 20: Duty to make reasonable adjustments
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => addCitation({
                          id: "leg2",
                          source: "Equality Act 2010",
                          type: "legislation", 
                          reference: "Section 20",
                          relevance: 89
                        })}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Cite
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="policies" className="mt-4">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50">
                      <h4 className="font-medium text-sm">HR Policy Manual</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Section 4.2.1: Disciplinary procedures and fair process
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => addCitation({
                          id: "pol1",
                          source: "HR Policy Manual",
                          type: "policy",
                          reference: "Section 4.2.1",
                          relevance: 76
                        })}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Cite
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
