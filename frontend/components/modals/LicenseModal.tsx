"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/file-upload";

interface LicenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId?: string;
  licenseId?: string | null;
}

export function LicenseModal({ open, onOpenChange, employeeId, licenseId: _licenseId }: LicenseModalProps) {
  const [formData, setFormData] = useState({
    employeeId: employeeId || "",
    type: "Pharmacist",
    licenseNumber: "",
    state: "",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
  });

  // const isEdit = !!licenseId; // Reserved for future edit functionality
  const queryClient = useQueryClient();

  // Fetch employees if no employeeId provided
  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get("/employees");
      return response.data.data;
    },
    enabled: !employeeId,
  });

  const employees = employeesData || [];

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/licenses", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
      toast.success("License added successfully");
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add License</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!employeeId && (
            <div>
              <Label htmlFor="employeeId">Employee</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp: any) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="type">License Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                <SelectItem value="Pharmacy Technician">Pharmacy Technician</SelectItem>
                <SelectItem value="Compounding Certificate">Compounding Certificate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <FileUpload
              label="Upload License Document (Optional)"
              accept="image/*,.pdf"
              maxSize={10}
              onUploadComplete={(_fileData) => {
                // File uploaded, can be associated with license after creation
                toast.success("Document uploaded");
              }}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Adding..." : "Add License"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

