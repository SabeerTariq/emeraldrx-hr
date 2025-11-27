"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { format } from "date-fns";
import { hasPermission, getUserPermissions } from "@/lib/permissions";
import { toast } from "sonner";

export default function SchedulingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);

  // Fetch user permissions
  const { data: permissions } = useQuery({
    queryKey: ["user-permissions"],
    queryFn: getUserPermissions,
  });

  const canCreate = permissions && hasPermission(permissions, "scheduling", "create");
  const canUpdate = permissions && hasPermission(permissions, "scheduling", "update");

  // Fetch shifts
  const { data: shiftsData, isLoading } = useQuery({
    queryKey: ["shifts", selectedDate],
    queryFn: async () => {
      const startDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = format(new Date(selectedDate || new Date()), "yyyy-MM-dd");
      const response = await api.get(`/scheduling/shifts?startDate=${startDate}&endDate=${endDate}`);
      return response.data.data;
    },
  });

  // Fetch employees for assignment
  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get("/employees");
      return response.data.data;
    },
  });

  const shifts = shiftsData || [];
  const employees = employeesData || [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shift Scheduling</h1>
        {canCreate && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Shift
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Shift</DialogTitle>
            </DialogHeader>
            <CreateShiftForm onSuccess={() => setIsDialogOpen(false)} employees={employees} />
          </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Edit Shift Dialog */}
      {canUpdate && selectedShift && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Shift</DialogTitle>
            </DialogHeader>
            <EditShiftForm 
              shift={selectedShift} 
              employees={employees}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedShift(null);
              }} 
            />
          </DialogContent>
        </Dialog>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Shifts for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select Date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading shifts...</div>
            ) : shifts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No shifts scheduled for this date</div>
            ) : (
              <div className="space-y-4">
                {shifts.map((shift: any) => (
                  <Card key={shift.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">
                              {format(new Date(shift.startTime), "h:mm a")} - {format(new Date(shift.endTime), "h:mm a")}
                            </Badge>
                            {shift.departmentName && (
                              <Badge variant="secondary">{shift.departmentName}</Badge>
                            )}
                          </div>
                          {shift.assignedEmployees && (
                            <p className="text-sm text-muted-foreground">
                              Assigned: {shift.assignedEmployees}
                            </p>
                          )}
                          {shift.notes && (
                            <p className="text-sm mt-2">{shift.notes}</p>
                          )}
                        </div>
                        {canUpdate && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedShift(shift);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CreateShiftForm({ onSuccess, employees }: { onSuccess: () => void; employees: any[] }) {
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "17:00",
    departmentId: "",
    notes: "",
    employeeIds: [] as string[],
  });

  const queryClient = useQueryClient();

  // Fetch departments
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await api.get("/departments");
      return response.data.data;
    },
  });

  const createShiftMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/scheduling/shifts", {
        ...data,
        startTime: `${data.date} ${data.startTime}:00`,
        endTime: `${data.date} ${data.endTime}:00`,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createShiftMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Select
            value={formData.departmentId}
            onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments?.map((dept: any) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="employees">Assign Employees</Label>
        <Select
          onValueChange={(value) => {
            if (!formData.employeeIds.includes(value)) {
              setFormData({ ...formData, employeeIds: [...formData.employeeIds, value] });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select employee to assign" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((emp: any) => (
              <SelectItem key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} ({emp.employeeId})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.employeeIds.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.employeeIds.map((empId) => {
              const emp = employees.find((e: any) => e.id === empId);
              return emp ? (
                <Badge key={empId} variant="secondary">
                  {emp.firstName} {emp.lastName}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        employeeIds: formData.employeeIds.filter((id) => id !== empId),
                      })
                    }
                    className="ml-2"
                  >
                    ×
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        )}
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
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={createShiftMutation.isPending}>
          {createShiftMutation.isPending ? "Creating..." : "Create Shift"}
        </Button>
      </div>
    </form>
  );
}

function EditShiftForm({ shift, onSuccess, employees }: { shift: any; onSuccess: () => void; employees: any[] }) {
  const [formData, setFormData] = useState({
    date: shift.date ? format(new Date(shift.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    startTime: shift.startTime ? format(new Date(shift.startTime), "HH:mm") : "09:00",
    endTime: shift.endTime ? format(new Date(shift.endTime), "HH:mm") : "17:00",
    departmentId: shift.departmentId || "",
    notes: shift.notes || "",
    employeeIds: [] as string[],
  });

  const queryClient = useQueryClient();

  // Fetch current shift assignments
  const { data: currentAssignments } = useQuery({
    queryKey: ["shift-assignments", shift.id],
    queryFn: async () => {
      const response = await api.get(`/scheduling/shifts/${shift.id}/assignments`);
      return response.data.data;
    },
    enabled: !!shift.id,
  });

  useEffect(() => {
    if (currentAssignments) {
      setFormData(prev => ({
        ...prev,
        employeeIds: currentAssignments.map((a: any) => a.employeeId)
      }));
    }
  }, [currentAssignments]);

  const updateShiftMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/scheduling/shifts/${shift.id}`, {
        ...data,
        startTime: `${data.date} ${data.startTime}:00`,
        endTime: `${data.date} ${data.endTime}:00`,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toast.success("Shift updated successfully");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update shift");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateShiftMutation.mutate(formData);
  };

  // Fetch departments
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await api.get("/departments");
      return response.data.data;
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-date">Date</Label>
          <Input
            id="edit-date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-department">Department</Label>
          <Select
            value={formData.departmentId}
            onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments?.map((dept: any) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-startTime">Start Time</Label>
          <Input
            id="edit-startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-endTime">End Time</Label>
          <Input
            id="edit-endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="edit-employees">Assign Employees</Label>
        <Select
          onValueChange={(value) => {
            if (!formData.employeeIds.includes(value)) {
              setFormData({ ...formData, employeeIds: [...formData.employeeIds, value] });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select employee to assign" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((emp: any) => (
              <SelectItem key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} ({emp.employeeId})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.employeeIds.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.employeeIds.map((empId) => {
              const emp = employees.find((e: any) => e.id === empId);
              return emp ? (
                <Badge key={empId} variant="secondary">
                  {emp.firstName} {emp.lastName}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        employeeIds: formData.employeeIds.filter((id) => id !== empId),
                      })
                    }
                    className="ml-2"
                  >
                    ×
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="edit-notes">Notes</Label>
        <Textarea
          id="edit-notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={updateShiftMutation.isPending}>
          {updateShiftMutation.isPending ? "Updating..." : "Update Shift"}
        </Button>
      </div>
    </form>
  );
}
