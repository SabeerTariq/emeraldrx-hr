"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Check, X, FileText } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { hasPermission, getUserPermissions } from "@/lib/permissions";

export default function HRDocumentsPage() {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Fetch user permissions
  const { data: permissions } = useQuery({
    queryKey: ["user-permissions"],
    queryFn: getUserPermissions,
  });

  const canCreate = permissions && hasPermission(permissions, "documents", "create");

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ["hr-documents"],
    queryFn: async () => {
      const res = await api.get("/hr-documents");
      return res.data.data;
    },
  });

  const { data: employeeUploads, isLoading: uploadsLoading } = useQuery({
    queryKey: ["employee-document-uploads"],
    queryFn: async () => {
      const response = await api.get("/hr-documents/employee-uploads");
      return response.data.data;
    },
  });

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const handleNewTemplate = () => {
    setSelectedTemplate(null);
    setIsTemplateModalOpen(true);
  };

  const pendingUploads = employeeUploads?.filter((upload: any) => upload.approvalStatus === "pending") || [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">HR Documents</h1>
          <p className="text-muted-foreground mt-1">Manage HR document templates and review employee uploads</p>
        </div>
        {canCreate && (
          <Button onClick={handleNewTemplate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Template
          </Button>
        )}
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">HR Templates</TabsTrigger>
          <TabsTrigger value="uploads">
            Employee Uploads
            {pendingUploads.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingUploads.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>HR Document Templates</CardTitle>
            </CardHeader>
            <CardContent>
              {templatesLoading ? (
                <div className="text-center py-8">Loading templates...</div>
              ) : templates && templates.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template: any) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.title}</TableCell>
                        <TableCell>{template.documentType}</TableCell>
                        <TableCell>{template.category || "N/A"}</TableCell>
                        <TableCell>
                          {template.isRequired ? (
                            <Badge variant="destructive">Required</Badge>
                          ) : (
                            <Badge variant="outline">Optional</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {template.isActive ? (
                            <Badge className="bg-green-500">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <a
                              href={template.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <FileText className="h-4 w-4" />
                              View
                            </a>
                            {permissions && hasPermission(permissions, "documents", "update") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTemplate(template)}
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No HR document templates. Click "Add Template" to create one.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employee Uploads Tab */}
        <TabsContent value="uploads">
          <div className="space-y-4">
            {/* Pending Uploads */}
            {pendingUploads.length > 0 && (
              <Card className="border-orange-500">
                <CardHeader>
                  <CardTitle className="text-orange-600">Pending Approvals ({pendingUploads.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUploads.map((upload: any) => (
                        <TableRow key={upload.id}>
                          <TableCell>
                            {upload.firstName} {upload.lastName}
                            <div className="text-sm text-muted-foreground">({upload.empId})</div>
                          </TableCell>
                          <TableCell className="font-medium">{upload.documentName}</TableCell>
                          <TableCell>{upload.documentType}</TableCell>
                          <TableCell>{format(new Date(upload.createdAt), "MMM d, yyyy")}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <a
                                href={upload.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                View
                              </a>
                              <ApproveButton uploadId={upload.id} permissions={permissions} />
                              <RejectButton uploadId={upload.id} permissions={permissions} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* All Uploads */}
            <Card>
              <CardHeader>
                <CardTitle>All Employee Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                {uploadsLoading ? (
                  <div className="text-center py-8">Loading uploads...</div>
                ) : employeeUploads && employeeUploads.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employeeUploads.map((upload: any) => (
                        <TableRow key={upload.id}>
                          <TableCell>
                            {upload.firstName} {upload.lastName}
                            <div className="text-sm text-muted-foreground">({upload.empId})</div>
                          </TableCell>
                          <TableCell className="font-medium">{upload.documentName}</TableCell>
                          <TableCell>{upload.documentType}</TableCell>
                          <TableCell>
                            {upload.approvalStatus === "approved" ? (
                              <Badge className="bg-green-500">Approved</Badge>
                            ) : upload.approvalStatus === "rejected" ? (
                              <Badge variant="destructive">Rejected</Badge>
                            ) : (
                              <Badge variant="default">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell>{format(new Date(upload.createdAt), "MMM d, yyyy")}</TableCell>
                          <TableCell>
                            <a
                              href={upload.fileUrl}
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
                  <div className="text-center py-8 text-muted-foreground">No employee uploads</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <HRDocumentTemplateModal
        open={isTemplateModalOpen}
        onOpenChange={setIsTemplateModalOpen}
        template={selectedTemplate}
      />
    </div>
  );
}

function HRDocumentTemplateModal({
  open,
  onOpenChange,
  template,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: any;
}) {
  const [formData, setFormData] = useState({
    title: template?.title || "",
    description: template?.description || "",
    documentType: template?.documentType || "W4",
    documentUrl: template?.documentUrl || "",
    isRequired: template?.isRequired || false,
    category: template?.category || "",
  });

  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/hr-documents", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-documents"] });
      toast.success("HR document template created successfully");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create template");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/hr-documents/${template.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-documents"] });
      toast.success("Template updated successfully");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update template");
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await api.post("/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({ ...formData, documentUrl: response.data.data.url });
      toast.success("Document uploaded successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (template) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? "Edit HR Document Template" : "Add HR Document Template"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="documentType">Document Type *</Label>
            <Select
              value={formData.documentType}
              onValueChange={(value) => setFormData({ ...formData, documentType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="W4">W4 Form</SelectItem>
                <SelectItem value="Availability">Availability Form</SelectItem>
                <SelectItem value="Direct Deposit">Direct Deposit Form</SelectItem>
                <SelectItem value="Emergency Contact">Emergency Contact Form</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Onboarding, Tax, Benefits"
            />
          </div>
          <div>
            <Label htmlFor="document">Document File (PDF)</Label>
            <Input
              id="document"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {formData.documentUrl && (
              <div className="mt-2">
                <a
                  href={formData.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  Current document
                </a>
              </div>
            )}
            {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isRequired"
              checked={formData.isRequired}
              onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="isRequired">Required Document</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : template
                ? "Update Template"
                : "Create Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ApproveButton({ uploadId, permissions }: { uploadId: string; permissions?: any }) {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put(`/hr-documents/employee-upload/${uploadId}/approve`, {
        approvedBy: "f50c3257-7329-4cbb-b21c-beddc84a3455", // Current user ID
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-document-uploads"] });
      toast.success("Document approved");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to approve document");
    },
  });

  const canApprove = permissions && hasPermission(permissions, "documents", "approve");

  if (!canApprove) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="text-green-600"
      onClick={() => approveMutation.mutate()}
      disabled={approveMutation.isPending}
    >
      <Check className="h-4 w-4" />
    </Button>
  );
}

function RejectButton({ uploadId, permissions }: { uploadId: string; permissions?: any }) {
  const queryClient = useQueryClient();
  const [rejectionReason, setRejectionReason] = useState("");

  const rejectMutation = useMutation({
    mutationFn: async (reason: string) => {
      const response = await api.put(`/hr-documents/employee-upload/${uploadId}/reject`, {
        approvedBy: "f50c3257-7329-4cbb-b21c-beddc84a3455",
        rejectionReason: reason,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-document-uploads"] });
      toast.success("Document rejected");
      setRejectionReason("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to reject document");
    },
  });

  const canReject = permissions && hasPermission(permissions, "documents", "reject");

  if (!canReject) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-red-600">
          <X className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="rejectionReason">Rejection Reason</Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setRejectionReason("")}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => rejectMutation.mutate(rejectionReason)}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? "Rejecting..." : "Reject Document"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

