"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EmployeePermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string | null;
  employeeName?: string;
}

const permissionModules = [
  "employees",
  "departments",
  "licenses",
  "pharmacy_licenses",
  "training",
  "scheduling",
  "leave",
  "attendance",
  "documents",
  "policies",
  "settings",
  "dashboard",
];

const permissionActions = ["create", "read", "update", "delete", "assign", "approve", "reject"];

export function EmployeePermissionsModal({
  open,
  onOpenChange,
  employeeId,
  employeeName,
}: EmployeePermissionsModalProps) {
  const queryClient = useQueryClient();
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});

  // Fetch current permissions
  const { data: currentPermissions, isLoading } = useQuery({
    queryKey: ["employee-permissions", employeeId],
    queryFn: async () => {
      if (!employeeId) return null;
      const response = await api.get(`/employees/${employeeId}/permissions`);
      return response.data.data.permissions;
    },
    enabled: open && !!employeeId,
  });

  useEffect(() => {
    if (currentPermissions) {
      setPermissions(currentPermissions);
    } else {
      // Initialize with empty permissions
      const emptyPerms: Record<string, string[]> = {};
      permissionModules.forEach((module) => {
        emptyPerms[module] = [];
      });
      setPermissions(emptyPerms);
    }
  }, [currentPermissions]);

  // Update permissions mutation
  const updateMutation = useMutation({
    mutationFn: async (perms: Record<string, string[]>) => {
      if (!employeeId) throw new Error("Employee ID required");
      const response = await api.put(`/employees/${employeeId}/permissions`, {
        permissions: perms,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-permissions", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["user-permissions"] });
      toast.success("Permissions updated successfully");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update permissions");
    },
  });

  // Remove permissions mutation (revert to role permissions)
  const removeMutation = useMutation({
    mutationFn: async () => {
      if (!employeeId) throw new Error("Employee ID required");
      const response = await api.delete(`/employees/${employeeId}/permissions`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-permissions", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["user-permissions"] });
      toast.success("Individual permissions removed. Employee will use role permissions.");
      setPermissions({});
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to remove permissions");
    },
  });

  const togglePermission = (module: string, action: string) => {
    setPermissions((prev) => {
      const newPermissions = { ...prev };
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
      return newPermissions;
    });
  };

  const hasPermission = (module: string, action: string) => {
    return permissions[module]?.includes(action) || false;
  };

  const handleSave = () => {
    // Filter out empty modules
    const filteredPermissions: Record<string, string[]> = {};
    Object.entries(permissions).forEach(([module, actions]) => {
      if (actions && actions.length > 0) {
        filteredPermissions[module] = actions;
      }
    });

    // If no permissions set, remove individual permissions
    if (Object.keys(filteredPermissions).length === 0) {
      removeMutation.mutate();
    } else {
      updateMutation.mutate(filteredPermissions);
    }
  };

  const handleReset = () => {
    if (currentPermissions) {
      setPermissions(currentPermissions);
    } else {
      const emptyPerms: Record<string, string[]> = {};
      permissionModules.forEach((module) => {
        emptyPerms[module] = [];
      });
      setPermissions(emptyPerms);
    }
  };

  if (!employeeId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Manage Individual Permissions
          </DialogTitle>
          <DialogDescription>
            {employeeName
              ? `Set custom permissions for ${employeeName}. Individual permissions override role permissions.`
              : "Set custom permissions for this employee. Individual permissions override role permissions."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Individual permissions override role-based permissions. 
                If you set individual permissions, the employee will use those instead of their role permissions.
                Leave all unchecked to use role permissions only.
              </p>
            </div>

            <div className="space-y-4">
              {permissionModules.map((module) => (
                <div key={module} className="border rounded-lg p-4">
                  <Label className="text-base font-semibold capitalize mb-3 block">
                    {module.replace(/_/g, " ")}
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {permissionActions.map((action) => (
                      <div key={action} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${module}-${action}`}
                          checked={hasPermission(module, action)}
                          onCheckedChange={() => togglePermission(module, action)}
                        />
                        <Label
                          htmlFor={`${module}-${action}`}
                          className="text-sm font-normal capitalize cursor-pointer"
                        >
                          {action}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {permissions[module] && permissions[module].length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {permissions[module].map((action) => (
                        <Badge key={action} variant="secondary" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleReset} disabled={updateMutation.isPending}>
            Reset
          </Button>
          <Button
            variant="destructive"
            onClick={() => removeMutation.mutate()}
            disabled={removeMutation.isPending || updateMutation.isPending}
          >
            {removeMutation.isPending ? "Removing..." : "Remove Individual Permissions"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending || removeMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Permissions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

