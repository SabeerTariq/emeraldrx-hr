"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { NewHireModal } from "@/components/modals/NewHireModal";

export default function OnboardingPage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get("/employees");
      return response.data.data;
    },
  });

  const { data: tasksData } = useQuery({
    queryKey: ["onboarding-tasks"],
    queryFn: async () => {
      const response = await api.get("/onboarding/tasks");
      return response.data.data;
    },
  });

  const { data: employeeTasksData } = useQuery({
    queryKey: ["employee-onboarding-tasks", selectedEmployeeId],
    queryFn: async () => {
      if (!selectedEmployeeId) return [];
      const response = await api.get(`/onboarding/employees/${selectedEmployeeId}`);
      return response.data.data;
    },
    enabled: !!selectedEmployeeId,
  });

  const employees = employeesData || [];
  const tasks = tasksData || [];
  const employeeTasks = employeeTasksData || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recruitment & Onboarding</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Hire
        </Button>
      </div>

      <NewHireModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        autoAssignOnboardingTasks={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {employees.map((emp: any) => (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmployeeId(emp.id)}
                  className={`w-full text-left p-3 rounded-md border transition-colors ${
                    selectedEmployeeId === emp.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                  <div className="text-sm opacity-80">{emp.employeeId}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Onboarding Tasks
              {selectedEmployeeId && employees.find((e: any) => e.id === selectedEmployeeId) && (
                <span className="text-muted-foreground font-normal text-base ml-2">
                  - {employees.find((e: any) => e.id === selectedEmployeeId)?.firstName}{" "}
                  {employees.find((e: any) => e.id === selectedEmployeeId)?.lastName}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedEmployeeId ? (
              <div className="text-center py-8 text-muted-foreground">
                Select an employee to view onboarding tasks
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task: any) => {
                    // Match by taskId or id (depending on API response structure)
                    const employeeTask = employeeTasks.find((et: any) => 
                      et.taskId === task.id || et.id === task.id
                    );
                    const status = employeeTask?.status || "pending";
                    
                    return (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.category}</TableCell>
                        <TableCell>{getStatusBadge(status)}</TableCell>
                        <TableCell>
                          {employeeTask?.completedAt
                            ? format(new Date(employeeTask.completedAt), "MMM d, yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {selectedEmployeeId && (
                            <TaskCompletionButton
                              taskId={task.id}
                              employeeId={selectedEmployeeId}
                              currentStatus={status}
                            />
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
      </div>
    </div>
  );
}


function TaskCompletionButton({
  taskId,
  employeeId,
  currentStatus,
}: {
  taskId: string;
  employeeId: string;
  currentStatus: string;
}) {
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.put(`/onboarding/tasks/${taskId}/complete`, {
        employeeId,
        notes: "Task completed",
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-onboarding-tasks"] });
      toast.success("Task marked as completed");
    },
  });

  if (currentStatus === "completed") {
    return <Badge className="bg-green-500">Completed</Badge>;
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => completeMutation.mutate()}
      disabled={completeMutation.isPending}
    >
      Mark Complete
    </Button>
  );
}
