"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function IncidentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["incidents"],
    queryFn: async () => {
      const response = await api.get("/incidents");
      return response.data.data;
    },
  });

  const incidents = data || [];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-600">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "closed":
        return <Badge className="bg-green-500">Closed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      default:
        return <Badge className="bg-yellow-500">Open</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Incident Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report Incident</DialogTitle>
            </DialogHeader>
            <IncidentForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Incidents</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <IncidentsTable incidents={incidents} isLoading={isLoading} getSeverityBadge={getSeverityBadge} getStatusBadge={getStatusBadge} onViewDetails={setSelectedIncident} />
        </TabsContent>
        <TabsContent value="open">
          <IncidentsTable incidents={incidents.filter((i: any) => i.status === "open")} isLoading={isLoading} getSeverityBadge={getSeverityBadge} getStatusBadge={getStatusBadge} onViewDetails={setSelectedIncident} />
        </TabsContent>
        <TabsContent value="in_progress">
          <IncidentsTable incidents={incidents.filter((i: any) => i.status === "in_progress")} isLoading={isLoading} getSeverityBadge={getSeverityBadge} getStatusBadge={getStatusBadge} onViewDetails={setSelectedIncident} />
        </TabsContent>
        <TabsContent value="closed">
          <IncidentsTable incidents={incidents.filter((i: any) => i.status === "closed")} isLoading={isLoading} getSeverityBadge={getSeverityBadge} getStatusBadge={getStatusBadge} onViewDetails={setSelectedIncident} />
        </TabsContent>
      </Tabs>

      {selectedIncident && (
        <IncidentDetailDialog
          incidentId={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
}

function IncidentsTable({
  incidents,
  isLoading,
  getSeverityBadge,
  getStatusBadge,
  onViewDetails,
}: {
  incidents: any[];
  isLoading: boolean;
  getSeverityBadge: (severity: string) => React.ReactNode;
  getStatusBadge: (status: string) => React.ReactNode;
  onViewDetails: (id: string) => void;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (incidents.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">No incidents found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident: any) => (
              <TableRow key={incident.id}>
                <TableCell>{incident.type}</TableCell>
                <TableCell className="font-medium">{incident.title}</TableCell>
                <TableCell>
                  {incident.firstName && incident.lastName
                    ? `${incident.firstName} ${incident.lastName}`
                    : "N/A"}
                </TableCell>
                <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                <TableCell>{getStatusBadge(incident.status)}</TableCell>
                <TableCell>{format(new Date(incident.reportedAt), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewDetails(incident.id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function IncidentForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    type: "HIPAA",
    title: "",
    description: "",
    employeeId: "",
    reportedBy: "f50c3257-7329-4cbb-b21c-beddc84a3455",
    severity: "low",
    occurredAt: format(new Date(), "yyyy-MM-dd"),
  });

  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get("/employees");
      return response.data.data;
    },
  });

  const employees = employeesData || [];
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/incidents", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      toast.success("Incident reported successfully");
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Incident Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HIPAA">HIPAA</SelectItem>
              <SelectItem value="Safety">Safety</SelectItem>
              <SelectItem value="Medication Error">Medication Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="severity">Severity</Label>
          <Select
            value={formData.severity}
            onValueChange={(value) => setFormData({ ...formData, severity: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={5}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="employeeId">Responsible Employee (Optional)</Label>
          <Select
            value={formData.employeeId}
            onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {employees.map((emp: any) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="occurredAt">Date Occurred</Label>
          <Input
            id="occurredAt"
            type="date"
            value={formData.occurredAt}
            onChange={(e) => setFormData({ ...formData, occurredAt: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </form>
  );
}

function IncidentDetailDialog({
  incidentId,
  onClose,
}: {
  incidentId: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["incident", incidentId],
    queryFn: async () => {
      const response = await api.get(`/incidents/${incidentId}`);
      return response.data.data;
    },
  });

  const statusUpdateMutation = useMutation({
    mutationFn: async ({ status, resolutionNotes }: { status: string; resolutionNotes?: string }) => {
      const response = await api.put(`/incidents/${incidentId}/status`, { status, resolutionNotes });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incident", incidentId] });
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      toast.success("Incident status updated");
    },
  });

  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get("/employees");
      return response.data.data;
    },
  });

  const employees = employeesData || [];
  const [showAddAction, setShowAddAction] = useState(false);
  const [actionForm, setActionForm] = useState({
    employeeId: "",
    title: "",
    description: "",
    dueDate: "",
  });

  const addCorrectiveActionMutation = useMutation({
    mutationFn: async (actionData: any) => {
      const response = await api.post(`/incidents/${incidentId}/corrective-actions`, actionData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incident", incidentId] });
      toast.success("Corrective action added");
      setShowAddAction(false);
      setActionForm({ employeeId: "", title: "", description: "", dueDate: "" });
    },
  });

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <div>Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-600">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "closed":
        return <Badge className="bg-green-500">Closed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      default:
        return <Badge className="bg-yellow-500">Open</Badge>;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{data?.title}</span>
            <div className="flex gap-2">
              {getSeverityBadge(data?.severity)}
              {getStatusBadge(data?.status)}
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold">Type</Label>
              <p className="text-sm">{data?.type}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Reported By</Label>
              <p className="text-sm">
                {data?.reporterFirstName} {data?.reporterLastName}
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Occurred At</Label>
              <p className="text-sm">{format(new Date(data?.occurredAt), "MMM d, yyyy h:mm a")}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Reported At</Label>
              <p className="text-sm">{format(new Date(data?.reportedAt), "MMM d, yyyy h:mm a")}</p>
            </div>
            {data?.employeeId && (
              <div>
                <Label className="text-sm font-semibold">Related Employee</Label>
                <p className="text-sm">
                  {data?.firstName} {data?.lastName} ({data?.employeeId})
                </p>
              </div>
            )}
          </div>

          <div>
            <Label className="text-sm font-semibold">Description</Label>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{data?.description}</p>
          </div>

          {data?.status !== "closed" && (
            <div className="border-t pt-4">
              <Label className="text-sm font-semibold mb-2 block">Update Status</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => statusUpdateMutation.mutate({ status: "in_progress" })}
                  disabled={data?.status === "in_progress" || statusUpdateMutation.isPending}
                >
                  Mark In Progress
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const notes = prompt("Enter resolution notes:");
                    if (notes) {
                      statusUpdateMutation.mutate({ status: "closed", resolutionNotes: notes });
                    }
                  }}
                  disabled={statusUpdateMutation.isPending}
                >
                  Close Incident
                </Button>
              </div>
            </div>
          )}

          {data?.resolutionNotes && (
            <div>
              <Label className="text-sm font-semibold">Resolution Notes</Label>
              <p className="text-sm text-muted-foreground mt-1">{data.resolutionNotes}</p>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-sm font-semibold">Corrective Actions</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddAction(!showAddAction)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Action
              </Button>
            </div>

            {showAddAction && (
              <Card className="mb-4">
                <CardContent className="pt-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addCorrectiveActionMutation.mutate(actionForm);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Assigned To</Label>
                        <Select
                          value={actionForm.employeeId}
                          onValueChange={(value) => setActionForm({ ...actionForm, employeeId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.map((emp: any) => (
                              <SelectItem key={emp.id} value={emp.id}>
                                {emp.firstName} {emp.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Due Date</Label>
                        <Input
                          type="datetime-local"
                          value={actionForm.dueDate}
                          onChange={(e) => setActionForm({ ...actionForm, dueDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={actionForm.title}
                        onChange={(e) => setActionForm({ ...actionForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={actionForm.description}
                        onChange={(e) => setActionForm({ ...actionForm, description: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowAddAction(false);
                          setActionForm({ employeeId: "", title: "", description: "", dueDate: "" });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" disabled={addCorrectiveActionMutation.isPending}>
                        Add Action
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {data?.correctiveActions && data.correctiveActions.length > 0 ? (
              <div className="space-y-2">
                {data.correctiveActions.map((action: any) => (
                  <Card key={action.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{action.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>
                              Assigned to: {action.firstName} {action.lastName}
                            </span>
                            <span>Due: {format(new Date(action.dueDate), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                        <Badge variant={action.status === "completed" ? "default" : "secondary"}>
                          {action.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No corrective actions yet</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
