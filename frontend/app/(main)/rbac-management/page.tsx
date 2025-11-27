"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { hasPermission, getUserPermissions } from "@/lib/permissions";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}

interface RoleFormData {
  name: string;
  description: string;
  permissions: Record<string, string[]>;
}

const defaultPermissions: Record<string, string[]> = {
  employees: [],
  roles: [],
  departments: [],
  licenses: [],
  pharmacy_licenses: [],
  training: [],
  my_trainings: [],
  scheduling: [],
  leave: [],
  attendance: [],
  documents: [],
  policies: [],
  settings: [],
  dashboard: [],
};

const permissionActions = ["create", "read", "update", "delete", "assign", "approve", "reject"];

export default function RBACManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    permissions: JSON.parse(JSON.stringify(defaultPermissions)),
  });
  const queryClient = useQueryClient();

  // Fetch user permissions
  const { data: permissions } = useQuery({
    queryKey: ["user-permissions"],
    queryFn: getUserPermissions,
  });

  const canCreate = permissions && hasPermission(permissions, "roles", "create");

  // Fetch roles
  const { data: roles, isLoading } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await api.get("/roles");
      return response.data.data;
    },
  });

  // Create role mutation
  const createMutation = useMutation({
    mutationFn: async (data: RoleFormData) => {
      const response = await api.post("/roles", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setIsDialogOpen(false);
      resetForm();
      toast.success("Role created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create role");
    },
  });

  // Update role mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RoleFormData> }) => {
      const response = await api.put(`/roles/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setIsDialogOpen(false);
      resetForm();
      toast.success("Role updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update role");
    },
  });

  // Delete role mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/roles/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setIsDeleteDialogOpen(false);
      setSelectedRole(null);
      toast.success("Role deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete role");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      permissions: JSON.parse(JSON.stringify(defaultPermissions)),
    });
    setSelectedRole(null);
  };

  const handleOpenDialog = (role?: Role) => {
    if (role) {
      setSelectedRole(role);
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions || JSON.parse(JSON.stringify(defaultPermissions)),
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      updateMutation.mutate({ id: selectedRole.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (selectedRole) {
      deleteMutation.mutate(selectedRole.id);
    }
  };

  const togglePermission = (module: string, action: string) => {
    setFormData((prev) => {
      const newPermissions = { ...prev.permissions };
      if (!newPermissions[module]) {
        newPermissions[module] = [];
      }
      const actions = [...newPermissions[module]];
      const index = actions.indexOf(action);
      if (index > -1) {
        actions.splice(index, 1);
      } else {
        actions.push(action);
      }
      newPermissions[module] = actions;
      return { ...prev, permissions: newPermissions };
    });
  };

  const hasFormPermission = (module: string, action: string) => {
    return formData.permissions[module]?.includes(action) || false;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">RBAC Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage roles and permissions for the system
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading roles...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles && roles.length > 0 ? (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(role.permissions || {}).map(([module, actions]) => {
                          if (actions && actions.length > 0) {
                            return (
                              <Badge key={module} variant="secondary">
                                {module}: {actions.length}
                              </Badge>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(role.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(role)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRole(role);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No roles found. Create your first role to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRole ? "Edit Role" : "Create New Role"}
            </DialogTitle>
            <DialogDescription>
              {selectedRole
                ? "Update role details and permissions"
                : "Create a new role with specific permissions"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., HR Admin, Department Manager"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the role's purpose and responsibilities"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label>Permissions</Label>
              <div className="border rounded-lg p-4 space-y-4 max-h-96 overflow-y-auto">
                {Object.keys(defaultPermissions).map((module) => (
                  <div key={module} className="space-y-2">
                    <div className="font-medium capitalize">{module}</div>
                    <div className="flex flex-wrap gap-2">
                      {permissionActions.map((action) => (
                        <Button
                          key={action}
                          type="button"
                          variant={hasFormPermission(module, action) ? "default" : "outline"}
                          size="sm"
                          onClick={() => togglePermission(module, action)}
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {selectedRole ? "Update" : "Create"} Role
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the role "{selectedRole?.name}"? This action
              cannot be undone. Make sure no employees are assigned to this role.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

