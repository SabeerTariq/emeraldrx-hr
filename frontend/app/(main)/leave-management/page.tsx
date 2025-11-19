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
import { Plus, Check, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function LeavePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["leave-requests"],
    queryFn: async () => {
      const response = await api.get("/leave");
      return response.data.data;
    },
  });

  const leaveRequests = data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leave Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Request Leave
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Leave</DialogTitle>
            </DialogHeader>
            <LeaveRequestForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : leaveRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No leave requests found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request: any) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      {request.firstName} {request.lastName} ({request.employeeId})
                    </TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{format(new Date(request.startDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(request.endDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <ApproveLeaveButton requestId={request.id} />
                          <RejectLeaveButton requestId={request.id} />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LeaveRequestForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    type: "PTO",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    reason: "",
    employeeId: "f50c3257-7329-4cbb-b21c-beddc84a3455", // Default to first employee for demo
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/leave", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      toast.success("Leave request submitted successfully");
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to submit leave request");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="type">Leave Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PTO">PTO</SelectItem>
            <SelectItem value="Sick Leave">Sick Leave</SelectItem>
            <SelectItem value="Unpaid Leave">Unpaid Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="reason">Reason</Label>
        <Textarea
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
}

function ApproveLeaveButton({ requestId }: { requestId: string }) {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: async () => {
      const response = await api.put(`/leave/${requestId}/approve`, {
        approvedBy: "f50c3257-7329-4cbb-b21c-beddc84a3455", // Current user ID
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      toast.success("Leave request approved");
    },
  });

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

function RejectLeaveButton({ requestId }: { requestId: string }) {
  const queryClient = useQueryClient();

  const rejectMutation = useMutation({
    mutationFn: async () => {
      const response = await api.put(`/leave/${requestId}/reject`, {
        approvedBy: "f50c3257-7329-4cbb-b21c-beddc84a3455",
        rejectionReason: "Not approved",
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      toast.success("Leave request rejected");
    },
  });

  return (
    <Button
      size="sm"
      variant="outline"
      className="text-red-600"
      onClick={() => rejectMutation.mutate()}
      disabled={rejectMutation.isPending}
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
