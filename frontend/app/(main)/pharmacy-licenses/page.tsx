"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { hasPermission, getUserPermissions } from "@/lib/permissions";

export default function PharmacyLicensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<any>(null);

  // Fetch user permissions
  const { data: permissions } = useQuery({
    queryKey: ["user-permissions"],
    queryFn: getUserPermissions,
  });

  const canCreate = permissions && hasPermission(permissions, "pharmacy_licenses", "create");
  const canUpdate = permissions && hasPermission(permissions, "pharmacy_licenses", "update");

  const { data, isLoading, error } = useQuery({
    queryKey: ["pharmacy-licenses"],
    queryFn: async () => {
      const response = await api.get("/pharmacy-licenses");
      return response.data.data;
    },
  });

  const licenses = data || [];

  const handleEdit = (license: any) => {
    setSelectedLicense(license);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedLicense(null);
    setIsModalOpen(true);
  };

  const getExpiryStatus = (daysUntilExpiry: number | null) => {
    if (daysUntilExpiry === null) return { variant: "secondary" as const, label: "N/A" };
    if (daysUntilExpiry < 0) return { variant: "destructive" as const, label: `Expired ${Math.abs(daysUntilExpiry)} days ago` };
    if (daysUntilExpiry <= 30) return { variant: "destructive" as const, label: `${daysUntilExpiry} days (Urgent!)` };
    if (daysUntilExpiry <= 60) return { variant: "default" as const, label: `${daysUntilExpiry} days (Warning)` };
    if (daysUntilExpiry <= 90) return { variant: "default" as const, label: `${daysUntilExpiry} days` };
    return { variant: "secondary" as const, label: `${daysUntilExpiry} days` };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Pharmacy Licenses</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Pharmacy Licenses</h1>
        <div className="text-red-500">Error loading pharmacy licenses</div>
      </div>
    );
  }

  const expiringSoon = licenses.filter((l: any) => l.daysUntilExpiry !== null && l.daysUntilExpiry <= 90 && l.daysUntilExpiry >= 0);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pharmacy Licenses</h1>
          <p className="text-muted-foreground mt-1">Track operational pharmacy licenses and certifications</p>
        </div>
        {canCreate && (
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Pharmacy License
          </Button>
        )}
      </div>

      {expiringSoon.length > 0 && (
        <Card className="mb-6 border-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Licenses Expiring Soon ({expiringSoon.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringSoon.map((license: any) => {
                const status = getExpiryStatus(license.daysUntilExpiry);
                return (
                  <div key={license.id} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <div>
                      <span className="font-medium">{license.licenseName}</span>
                      <span className="text-muted-foreground ml-2">({license.licenseNumber})</span>
                      <span className="text-muted-foreground ml-2">
                        - Expires: {format(new Date(license.expirationDate), "MMM d, yyyy")}
                      </span>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Pharmacy Licenses</CardTitle>
        </CardHeader>
        <CardContent>
          {licenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pharmacy licenses found. Click "Add Pharmacy License" to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>License Name</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licenses.map((license: any) => {
                  const status = getExpiryStatus(license.daysUntilExpiry);
                  return (
                    <TableRow key={license.id}>
                      <TableCell className="font-medium">{license.licenseName}</TableCell>
                      <TableCell className="font-mono">{license.licenseNumber}</TableCell>
                      <TableCell>{license.state}</TableCell>
                      <TableCell>{format(new Date(license.issueDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>{format(new Date(license.expirationDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        {license.documentUrl ? (
                          <a
                            href={license.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            View
                          </a>
                        ) : (
                          <span className="text-muted-foreground">No document</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {canUpdate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(license)}
                          >
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PharmacyLicenseModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        license={selectedLicense}
      />
    </div>
  );
}

function PharmacyLicenseModal({
  open,
  onOpenChange,
  license,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  license: any;
}) {
  const [formData, setFormData] = useState({
    licenseName: license?.licenseName || "",
    licenseNumber: license?.licenseNumber || "",
    state: license?.state || "",
    issueDate: license?.issueDate ? format(new Date(license.issueDate), "yyyy-MM-dd") : "",
    expirationDate: license?.expirationDate ? format(new Date(license.expirationDate), "yyyy-MM-dd") : "",
    documentUrl: license?.documentUrl || "",
    notes: license?.notes || "",
  });

  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/pharmacy-licenses", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy-licenses"] });
      toast.success("Pharmacy license created successfully");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create pharmacy license");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/pharmacy-licenses/${license.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy-licenses"] });
      toast.success("Pharmacy license updated successfully");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update pharmacy license");
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

      setFormData((prev) => ({ ...prev, documentUrl: response.data.data.url }));
      toast.success("Document uploaded successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (license) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{license ? "Edit Pharmacy License" : "Add Pharmacy License"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="licenseName">License Name *</Label>
              <Input
                id="licenseName"
                value={formData.licenseName}
                onChange={(e) => setFormData({ ...formData, licenseName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="licenseNumber">License Number *</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="issueDate">Issue Date *</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="expirationDate">Expiration Date *</Label>
            <Input
              id="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="document">License Document (PDF)</Label>
            <Input
              id="document"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
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

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : license
                ? "Update License"
                : "Create License"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

