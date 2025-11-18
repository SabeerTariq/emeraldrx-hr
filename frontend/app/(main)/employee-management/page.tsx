"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmployeeModal } from "@/components/modals/EmployeeModal";
import { NewHireModal } from "@/components/modals/NewHireModal";
import { Plus, Pencil, UserPlus } from "lucide-react";

export default function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewHireModalOpen, setIsNewHireModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // When editing, use EmployeeModal; when adding new, use NewHireModal
  const handleAdd = () => {
    setIsNewHireModalOpen(true);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get("/employees");
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Employees</h1>
        </div>
        <div className="text-center">Loading employees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Employees</h1>
        </div>
        <div className="text-red-500">Error loading employees</div>
      </div>
    );
  }

  const employees = data || [];

  const handleEdit = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <Button onClick={() => setIsNewHireModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          New Hire / Add Employee
        </Button>
      </div>
      
      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee: any) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.employeeId}</TableCell>
                <TableCell>
                  {employee.firstName} {employee.lastName}
                </TableCell>
                <TableCell className="text-muted-foreground">{employee.email}</TableCell>
                <TableCell>{employee.departmentName || "N/A"}</TableCell>
                <TableCell>{employee.roles || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant={employee.isActive ? "default" : "secondary"}>
                    {employee.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(employee.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {employees.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">No employees found</div>
        )}
      </div>

      <EmployeeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        employeeId={selectedEmployeeId || undefined}
      />

      <NewHireModal
        open={isNewHireModalOpen}
        onOpenChange={setIsNewHireModalOpen}
        autoAssignOnboardingTasks={true}
      />
    </div>
  );
}
