"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Upload, FileText, Calendar, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function EmployeePortalPage() {
  const [employeeId] = useState("f50c3257-7329-4cbb-b21c-beddc84a3455"); // In production, get from auth context

  const { data: employee, isLoading: employeeLoading } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: async () => {
      const response = await api.get(`/employees/${employeeId}`);
      return response.data.data;
    },
    enabled: !!employeeId,
  });

  const { data: ptoBalance } = useQuery({
    queryKey: ["pto-balance", employeeId],
    queryFn: async () => {
      const response = await api.get(`/pto/balance/${employeeId}`);
      return response.data.data;
    },
    enabled: !!employeeId,
  });

  const { data: upcomingShifts } = useQuery({
    queryKey: ["upcoming-shifts", employeeId],
    queryFn: async () => {
      const response = await api.get(`/scheduling/shifts?employeeId=${employeeId}&startDate=${format(new Date(), "yyyy-MM-dd")}`);
      return response.data.data || [];
    },
    enabled: !!employeeId,
  });

  const { data: pendingApprovals } = useQuery({
    queryKey: ["pending-approvals", employeeId],
    queryFn: async () => {
      const response = await api.get(`/leave?employeeId=${employeeId}&status=pending`);
      return response.data.data || [];
    },
    enabled: !!employeeId,
  });

  const { data: trainingStatus } = useQuery({
    queryKey: ["training-status", employeeId],
    queryFn: async () => {
      const response = await api.get(`/training?employeeId=${employeeId}`);
      return response.data.data || [];
    },
    enabled: !!employeeId,
  });

  const { data: documents } = useQuery({
    queryKey: ["employee-documents", employeeId],
    queryFn: async () => {
      const response = await api.get(`/hr-documents/employee-uploads?employeeId=${employeeId}`);
      return response.data.data || [];
    },
    enabled: !!employeeId,
  });

  const { data: hrDocuments } = useQuery({
    queryKey: ["hr-documents-templates"],
    queryFn: async () => {
      const res = await api.get("/hr-documents/templates");
      return res.data.data || [];
    },
  });

  const { data: departmentSchedule } = useQuery({
    queryKey: ["department-schedule", employee?.departmentId],
    queryFn: async () => {
      if (!employee?.departmentId) return [];
      const response = await api.get(`/scheduling/shifts?departmentId=${employee.departmentId}&startDate=${format(new Date(), "yyyy-MM-dd")}`);
      return response.data.data || [];
    },
    enabled: !!employee?.departmentId,
  });

  const { data: attendanceHours } = useQuery({
    queryKey: ["attendance-hours", employeeId],
    queryFn: async () => {
      const startDate = format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd");
      const response = await api.get(`/attendance/logs?employeeId=${employeeId}&startDate=${startDate}`);
      const logs = response.data.data || [];
      const totalHours = logs
        .filter((log: any) => log.clockOut)
        .reduce((sum: number, log: any) => sum + (parseFloat(log.totalHours) || 0), 0);
      return totalHours;
    },
    enabled: !!employeeId,
  });

  if (employeeLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Employee Portal</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const pendingTrainings = trainingStatus?.filter((t: any) => t.status === "pending" || t.status === "overdue") || [];
  const completedTrainings = trainingStatus?.filter((t: any) => t.status === "completed") || [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employee Portal</h1>
          <p className="text-muted-foreground mt-1">Welcome, {employee?.firstName} {employee?.lastName}</p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Hours Worked (7 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendanceHours?.toFixed(1) || 0} hrs</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">PTO Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {ptoBalance ? parseFloat(ptoBalance.remainingBalance || 0).toFixed(1) : 0} hrs
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingApprovals?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Trainings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingTrainings.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Upcoming Shifts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Shifts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingShifts && upcomingShifts.length > 0 ? (
                  <div className="space-y-2">
                    {upcomingShifts.slice(0, 5).map((shift: any) => (
                      <div key={shift.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <div className="font-medium">{format(new Date(shift.date), "MMM d, yyyy")}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(shift.startTime), "h:mm a")} - {format(new Date(shift.endTime), "h:mm a")}
                          </div>
                        </div>
                        <Badge variant="outline">{shift.departmentName || "N/A"}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No upcoming shifts</div>
                )}
              </CardContent>
            </Card>

            {/* Training Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Training Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingTrainings.length > 0 ? (
                  <div className="space-y-2">
                    {pendingTrainings.slice(0, 5).map((training: any) => (
                      <div key={training.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <div className="font-medium">{training.trainingTitle}</div>
                          <div className="text-sm text-muted-foreground">
                            Due: {training.dueDate ? format(new Date(training.dueDate), "MMM d, yyyy") : "N/A"}
                          </div>
                        </div>
                        <Badge variant={training.status === "overdue" ? "destructive" : "default"}>
                          {training.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {completedTrainings.length > 0 ? "All trainings completed!" : "No trainings assigned"}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Personal Info Tab */}
        <TabsContent value="personal-info">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              <Button variant="outline" size="sm" disabled>
                <Pencil className="mr-2 h-4 w-4" />
                Edit (Coming Soon)
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <div className="mt-1 font-medium">{employee?.firstName}</div>
                </div>
                <div>
                  <Label>Last Name</Label>
                  <div className="mt-1 font-medium">{employee?.lastName}</div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="mt-1">{employee?.email}</div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="mt-1">{employee?.phone || "N/A"}</div>
                </div>
                <div className="col-span-2">
                  <Label>Address</Label>
                  <div className="mt-1">
                    {employee?.address ? (
                      <>
                        {employee.address}
                        {employee.city && `, ${employee.city}`}
                        {employee.state && `, ${employee.state}`}
                        {employee.zipCode && ` ${employee.zipCode}`}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">Emergency contacts can be managed by HR</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          {/* HR-Provided Documents */}
          <Card>
            <CardHeader>
              <CardTitle>HR-Provided Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {hrDocuments && hrDocuments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hrDocuments.map((doc: any) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.title}</TableCell>
                        <TableCell>{doc.documentType}</TableCell>
                        <TableCell>
                          {doc.isRequired ? (
                            <Badge variant="destructive">Required</Badge>
                          ) : (
                            <Badge variant="outline">Optional</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <a
                            href={doc.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            View/Download
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No HR documents available</div>
              )}
            </CardContent>
          </Card>

          {/* My Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Document Uploads</CardTitle>
              <DocumentUploadDialog employeeId={employeeId} />
            </CardHeader>
            <CardContent>
              {documents && documents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc: any) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.documentName}</TableCell>
                        <TableCell>{doc.documentType}</TableCell>
                        <TableCell>
                          {doc.approvalStatus === "approved" ? (
                            <Badge className="bg-green-500">Approved</Badge>
                          ) : doc.approvalStatus === "rejected" ? (
                            <Badge variant="destructive">Rejected</Badge>
                          ) : (
                            <Badge variant="default">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>{format(new Date(doc.createdAt), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No documents uploaded yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Department Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {departmentSchedule && departmentSchedule.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Assigned Employees</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentSchedule.map((shift: any) => (
                      <TableRow key={shift.id}>
                        <TableCell>{format(new Date(shift.date), "MMM d, yyyy (EEE)")}</TableCell>
                        <TableCell>{format(new Date(shift.startTime), "h:mm a")}</TableCell>
                        <TableCell>{format(new Date(shift.endTime), "h:mm a")}</TableCell>
                        <TableCell>{shift.role || "N/A"}</TableCell>
                        <TableCell>
                          {shift.assignedEmployees ? shift.assignedEmployees.split(",").length : 0} employees
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No schedule available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DocumentUploadDialog({ employeeId }: { employeeId: string }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    documentName: "",
    documentType: "Other",
    hrDocumentId: "",
  });

  const queryClient = useQueryClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await api.post("/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await api.post(`/hr-documents/employee-uploads/${employeeId}`, {
        hrDocumentId: formData.hrDocumentId || null,
        documentName: formData.documentName || file.name,
        documentType: formData.documentType,
        fileUrl: uploadResponse.data.data.url,
        fileSize: file.size,
        mimeType: file.type,
      });

      queryClient.invalidateQueries({ queryKey: ["employee-documents", employeeId] });
      toast.success("Document uploaded successfully. Awaiting admin approval.");
      setOpen(false);
      setFormData({ documentName: "", documentType: "Other", hrDocumentId: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="documentName">Document Name</Label>
            <Input
              id="documentName"
              value={formData.documentName}
              onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
              placeholder="Enter document name"
            />
          </div>
          <div>
            <Label htmlFor="documentType">Document Type</Label>
            <Input
              id="documentType"
              value={formData.documentType}
              onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
              placeholder="e.g., Certificate, License, etc."
            />
          </div>
          <div>
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

