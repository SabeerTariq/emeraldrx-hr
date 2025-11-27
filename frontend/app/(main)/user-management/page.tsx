"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Key, Shield, Settings } from "lucide-react";
import { toast } from "sonner";
import { EmployeePermissionsModal } from "@/components/modals/EmployeePermissionsModal";

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentName: string;
  roles: string;
  isActive: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface CredentialsFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function UserManagementPage() {
  const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false);
  const [isRolesDialogOpen, setIsRolesDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [credentialsForm, setCredentialsForm] = useState<CredentialsFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // Fetch employees
  const { data: employees, isLoading: employeesLoading } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get("/employees");
      return response.data.data;
    },
  });

  // Fetch roles
  const { data: roles, isLoading: rolesLoading } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await api.get("/roles");
      return response.data.data;
    },
  });

  // Fetch employee roles when dialog opens
  const { data: employeeRoles } = useQuery<Role[]>({
    queryKey: ["employee-roles", selectedEmployee?.id],
    queryFn: async () => {
      if (!selectedEmployee) return [];
      const response = await api.get(`/employees/${selectedEmployee.id}/roles`);
      return response.data.data;
    },
    enabled: !!selectedEmployee && isRolesDialogOpen,
  });

  // Update credentials mutation
  const updateCredentialsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { email?: string; password?: string } }) => {
      const response = await api.put(`/employees/${id}/credentials`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsCredentialsDialogOpen(false);
      setCredentialsForm({ email: "", password: "", confirmPassword: "" });
      setSelectedEmployee(null);
      toast.success("Credentials updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update credentials");
    },
  });

  // Update roles mutation
  const updateRolesMutation = useMutation({
    mutationFn: async ({ id, roleIds }: { id: string; roleIds: string[] }) => {
      const response = await api.post(`/employees/${id}/roles`, { roleIds });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee-roles"] });
      setIsRolesDialogOpen(false);
      setSelectedRoleIds([]);
      setSelectedEmployee(null);
      toast.success("Roles updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update roles");
    },
  });

  const handleOpenCredentialsDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setCredentialsForm({
      email: employee.email,
      password: "",
      confirmPassword: "",
    });
    setIsCredentialsDialogOpen(true);
  };

  const handleOpenRolesDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsRolesDialogOpen(true);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    // Validate password if provided
    if (credentialsForm.password) {
      if (credentialsForm.password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
      if (credentialsForm.password !== credentialsForm.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    const updateData: { email?: string; password?: string } = {};
    if (credentialsForm.email !== selectedEmployee.email) {
      updateData.email = credentialsForm.email;
    }
    if (credentialsForm.password) {
      updateData.password = credentialsForm.password;
    }

    if (Object.keys(updateData).length === 0) {
      toast.error("No changes to save");
      return;
    }

    updateCredentialsMutation.mutate({ id: selectedEmployee.id, data: updateData });
  };

  const handleRolesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    updateRolesMutation.mutate({ id: selectedEmployee.id, roleIds: selectedRoleIds });
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((id) => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  // Update selected roles when employee roles change
  useEffect(() => {
    if (employeeRoles && employeeRoles.length > 0 && isRolesDialogOpen) {
      setSelectedRoleIds(employeeRoles.map((r) => r.id));
    } else if (!employeeRoles || employeeRoles.length === 0) {
      setSelectedRoleIds([]);
    }
  }, [employeeRoles, isRolesDialogOpen]);

  if (employeesLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage employee login credentials and role assignments
        </p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees && employees.length > 0 ? (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.employeeId}</TableCell>
                  <TableCell>
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.departmentName || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {employee.roles
                        ? employee.roles.split(",").map((role, idx) => (
                            <Badge key={idx} variant="secondary">
                              {role}
                            </Badge>
                          ))
                        : "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.isActive ? "default" : "secondary"}>
                      {employee.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenCredentialsDialog(employee)}
                        title="Manage Credentials"
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenRolesDialog(employee)}
                        title="Manage Roles"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setIsPermissionsDialogOpen(true);
                        }}
                        title="Manage Individual Permissions"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Credentials Dialog */}
      <Dialog open={isCredentialsDialogOpen} onOpenChange={setIsCredentialsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Credentials</DialogTitle>
            <DialogDescription>
              Update login credentials for {selectedEmployee?.firstName}{" "}
              {selectedEmployee?.lastName}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={credentialsForm.email}
                onChange={(e) =>
                  setCredentialsForm({ ...credentialsForm, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={credentialsForm.password}
                onChange={(e) =>
                  setCredentialsForm({ ...credentialsForm, password: e.target.value })
                }
                placeholder="Leave blank to keep current password"
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters. Leave blank to keep current password.
              </p>
            </div>

            {credentialsForm.password && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={credentialsForm.confirmPassword}
                  onChange={(e) =>
                    setCredentialsForm({
                      ...credentialsForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                  minLength={8}
                />
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCredentialsDialogOpen(false);
                  setCredentialsForm({ email: "", password: "", confirmPassword: "" });
                  setSelectedEmployee(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateCredentialsMutation.isPending}
              >
                Update Credentials
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Roles Dialog */}
      <Dialog open={isRolesDialogOpen} onOpenChange={setIsRolesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Roles</DialogTitle>
            <DialogDescription>
              Assign roles to {selectedEmployee?.firstName}{" "}
              {selectedEmployee?.lastName}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRolesSubmit} className="space-y-4">
            {rolesLoading ? (
              <div className="text-center py-4">Loading roles...</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {roles && roles.length > 0 ? (
                  roles.map((role) => {
                    const isSelected = selectedRoleIds.includes(role.id);
                    
                    return (
                      <div
                        key={role.id}
                        className="flex items-start space-x-3 p-3 border rounded-lg"
                      >
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={isSelected}
                          onCheckedChange={() => toggleRole(role.id)}
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={`role-${role.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {role.name}
                          </Label>
                          {role.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {role.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No roles available. Create roles first.
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsRolesDialogOpen(false);
                  setSelectedRoleIds([]);
                  setSelectedEmployee(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateRolesMutation.isPending || rolesLoading}
              >
                Update Roles
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <EmployeePermissionsModal
        open={isPermissionsDialogOpen}
        onOpenChange={setIsPermissionsDialogOpen}
        employeeId={selectedEmployee?.id || null}
        employeeName={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : undefined}
      />
    </div>
  );
}

