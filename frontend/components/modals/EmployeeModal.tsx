"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface EmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId?: string | null;
}

export function EmployeeModal({ open, onOpenChange, employeeId }: EmployeeModalProps) {
  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    hireDate: new Date().toISOString().split("T")[0],
    terminationDate: "",
    departmentId: "",
    designation: "",
    isActive: true,
    password: "",
    employeeType: "member" as "member" | "lead",
  });

  const [activeTab, setActiveTab] = useState("personal");

  const isEdit = !!employeeId;
  const queryClient = useQueryClient();

  // Fetch employee data if editing
  const { data: employeeData } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: async () => {
      const response = await api.get(`/employees/${employeeId}`);
      return response.data.data;
    },
    enabled: isEdit && !!employeeId,
  });

  // Fetch departments
  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await api.get("/departments");
      return response.data.data;
    },
  });

  // Fetch employee roles if editing
  const { data: employeeRoles } = useQuery({
    queryKey: ["employee-roles", employeeId],
    queryFn: async () => {
      if (!employeeId) return [];
      const response = await api.get(`/employees/${employeeId}/roles`);
      return response.data.data;
    },
    enabled: isEdit && !!employeeId,
  });

  // Fetch roles for reference
  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      try {
        const response = await api.get("/roles");
        return response.data.data || [];
      } catch {
        return [];
      }
    },
  });

  // Get role IDs for Employee and Department Lead
  const employeeRoleId = rolesData?.find((r: any) => r.name === "Employee")?.id;
  const departmentLeadRoleId = rolesData?.find((r: any) => r.name === "Department Lead")?.id;

  useEffect(() => {
    if (employeeData) {
      setFormData({
        employeeId: employeeData.employeeId || "",
        firstName: employeeData.firstName || "",
        lastName: employeeData.lastName || "",
        email: employeeData.email || "",
        phone: employeeData.phone || "",
        dateOfBirth: employeeData.dateOfBirth ? new Date(employeeData.dateOfBirth).toISOString().split("T")[0] : "",
        address: employeeData.address || "",
        city: employeeData.city || "",
        state: employeeData.state || "",
        zipCode: employeeData.zipCode || "",
        hireDate: employeeData.hireDate ? new Date(employeeData.hireDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        terminationDate: employeeData.terminationDate ? new Date(employeeData.terminationDate).toISOString().split("T")[0] : "",
        departmentId: employeeData.departmentId || "",
        designation: employeeData.designation || "",
        isActive: employeeData.isActive !== undefined ? employeeData.isActive : true,
        password: "",
        employeeType: "member", // Will be determined from roles
      });
    }
  }, [employeeData]);

  // Determine employee type from roles
  useEffect(() => {
    if (employeeRoles && employeeRoles.length > 0) {
      const hasLeadRole = employeeRoles.some((role: any) => role.name === "Department Lead");
      const hasEmployeeRole = employeeRoles.some((role: any) => role.name === "Employee");
      
      if (hasLeadRole) {
        setFormData(prev => ({ ...prev, employeeType: "lead" }));
      } else if (hasEmployeeRole) {
        setFormData(prev => ({ ...prev, employeeType: "member" }));
      }
    }
  }, [employeeRoles]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/employees", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee created successfully");
      onOpenChange(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      // Remove password if empty
      const updateData = { ...data };
      if (!updateData.password || updateData.password.trim() === "") {
        delete updateData.password;
      }

      // Remove employeeType from update data (we'll handle role update separately)
      const { employeeType, ...employeeUpdateData } = updateData;
      
      // Update employee data
      const response = await api.put(`/employees/${employeeId}`, employeeUpdateData);
      
      // Update role if employee type changed
      if (employeeType && (employeeRoleId || departmentLeadRoleId)) {
        let roleIdToAssign: string | null = null;
        if (employeeType === "member" && employeeRoleId) {
          roleIdToAssign = employeeRoleId;
        } else if (employeeType === "lead" && departmentLeadRoleId) {
          roleIdToAssign = departmentLeadRoleId;
        }

        if (roleIdToAssign) {
          try {
            await api.post(`/employees/${employeeId}/roles`, {
              roleIds: [roleIdToAssign]
            });
          } catch (error) {
            console.error("Failed to update role:", error);
            // Don't fail the whole update if role update fails
          }
        }
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["employee-roles"] });
      toast.success("Employee updated successfully");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update employee");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      if (!formData.password) {
        toast.error("Password is required for new employees");
        return;
      }
      createMutation.mutate(formData);
    }
  };

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update employee information. Changes will be saved immediately."
              : "Fill in the employee details to create a new employee record."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="status">Status & Roles</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Basic personal details of the employee</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth || ""}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city || ""}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={formData.state || ""}
                        onValueChange={(value) => setFormData({ ...formData, state: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode || ""}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Employment Information Tab */}
            <TabsContent value="employment" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Employment Information</CardTitle>
                  <CardDescription>Employment details and department assignment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employeeId">Employee ID *</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
                        required
                        disabled={isEdit}
                        placeholder="EMP001"
                      />
                      {isEdit && (
                        <p className="text-xs text-muted-foreground mt-1">Employee ID cannot be changed</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="departmentId">Department *</Label>
                      <Select
                        value={formData.departmentId || ""}
                        onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentsData?.map((dept: any) => (
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
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        value={formData.designation || ""}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        placeholder="e.g., Senior Technician, Manager, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="hireDate">Hire Date *</Label>
                      <Input
                        id="hireDate"
                        type="date"
                        value={formData.hireDate}
                        onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="employeeType">Employee Type *</Label>
                    <Select
                      value={formData.employeeType}
                      onValueChange={(value: "member" | "lead") => setFormData({ ...formData, employeeType: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.employeeType === "member" 
                        ? "Member: Will be assigned 'Employee' role. Can view own information only."
                        : "Lead: Will be assigned 'Department Lead' role. Can view own information and department members' information (read-only)."}
                    </p>
                    {!formData.departmentId && (
                      <p className="text-xs text-amber-600 mt-1">
                        ⚠️ Please select a department first. Department Leads can only view employees in their assigned department.
                      </p>
                    )}
                  </div>

                  {!isEdit && (
                    <div>
                      <Label htmlFor="password">Initial Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Employee will be asked to change on first login"
                        required
                        minLength={8}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Status & Roles Tab */}
            <TabsContent value="status" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Status</CardTitle>
                  <CardDescription>Manage employee active status and termination</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="isActive" className="text-base font-medium">Active Status</Label>
                      <p className="text-sm text-muted-foreground">
                        {formData.isActive 
                          ? "Employee is currently active in the system"
                          : "Employee is inactive and cannot access the system"}
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                  </div>

                  {!formData.isActive && (
                    <div>
                      <Label htmlFor="terminationDate">Termination Date</Label>
                      <Input
                        id="terminationDate"
                        type="date"
                        value={formData.terminationDate || ""}
                        onChange={(e) => setFormData({ ...formData, terminationDate: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Date when the employee was terminated or left the company
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {isEdit && employeeRoles && (
                <Card>
                  <CardHeader>
                    <CardTitle>Current Roles</CardTitle>
                    <CardDescription>Roles assigned to this employee</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {employeeRoles.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {employeeRoles.map((role: any) => (
                          <Badge key={role.id} variant="secondary" className="text-sm">
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No roles assigned</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      To change roles, use the User Management page
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {isEdit 
                ? (updateMutation.isPending ? "Updating..." : "Update Employee") 
                : (createMutation.isPending ? "Creating..." : "Create Employee")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

