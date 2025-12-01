"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmployeeModal } from "@/components/modals/EmployeeModal";
import { NewHireModal } from "@/components/modals/NewHireModal";
import { Pencil, UserPlus, Trash2 } from "lucide-react";
import { hasPermission, getUserPermissions } from "@/lib/permissions";
import { toast } from "sonner";

export default function EmployeesPage() {
  // State declarations (must be before early returns for linter)
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isNewHireModalOpen, setIsNewHireModalOpen] = React.useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{ id: string; name: string; employeeId: string } | null>(null);
  const queryClient = useQueryClient();

  // Fetch user permissions
  const { data: permissions } = useQuery({
    queryKey: ["user-permissions"],
    queryFn: getUserPermissions,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get("/employees");
      return response.data.data;
    },
  });

  const canCreate = permissions && hasPermission(permissions, "employees", "create");
  const canUpdate = permissions && hasPermission(permissions, "employees", "update");
  const canDelete = permissions && hasPermission(permissions, "employees", "delete");

  // Delete employee mutation
  const deleteMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const response = await api.delete(`/employees/${employeeId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee deleted successfully");
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete employee");
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

  const handleDeleteClick = (employee: any) => {
    setEmployeeToDelete({
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      employeeId: employee.employeeId,
    });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      deleteMutation.mutate(employeeToDelete.id);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        {canCreate && (
          <Button onClick={() => setIsNewHireModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Hire / Add Employee
          </Button>
        )}
      </div>
      
      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Role</TableHead>
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
                <TableCell>{employee.designation || "N/A"}</TableCell>
                <TableCell>{employee.roles || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant={employee.isActive ? "default" : "secondary"}>
                    {employee.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {canUpdate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(employee.id)}
                        title="Edit Employee"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(employee)}
                        title="Delete Employee"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
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
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{employeeToDelete?.name}</strong> ({employeeToDelete?.employeeId})?
              <br /><br />
              This action <strong>cannot be undone</strong>. This will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Employee record and all personal information</li>
                <li>All assigned roles and permissions</li>
                <li>Attendance logs and shift assignments</li>
                <li>Leave requests and PTO balances</li>
                <li>Training records and licenses</li>
                <li>All other related records</li>
              </ul>
              <br />
              <strong className="text-destructive">Consider deactivating the employee instead if you want to preserve historical data.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Employee"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
