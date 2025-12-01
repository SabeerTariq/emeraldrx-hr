"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, X, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface NewHireModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export function NewHireModal({ open, onOpenChange }: NewHireModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("personal");

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
    departmentId: "",
    password: "",
    employeeType: "member" as "member" | "lead", // member or lead
    roleIds: [] as string[],
  });

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: "", relationship: "", phone: "", email: "", isPrimary: true },
  ]);

  // Fetch departments
  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await api.get("/departments");
      return response.data.data;
    },
  });

  // Fetch roles to get Employee and Department Lead role IDs
  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      try {
        const response = await api.get("/roles");
        return response.data.data || [];
      } catch {
        // If roles endpoint doesn't exist, return empty array
        return [];
      }
    },
  });

  // Get role IDs for Employee and Department Lead
  const employeeRoleId = rolesData?.find((r: any) => r.name === "Employee")?.id;
  const departmentLeadRoleId = rolesData?.find((r: any) => r.name === "Department Lead")?.id;

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/employees", data);
      return response.data;
    },
    onSuccess: async (data) => {
      const employeeId = data.data.id;

      // Add emergency contacts
      if (emergencyContacts.some(ec => ec.name && ec.phone)) {
        try {
          await api.post(`/employees/${employeeId}/emergency-contacts`, {
            contacts: emergencyContacts.filter(ec => ec.name && ec.phone)
          });
        } catch (error) {
          console.error("Failed to add emergency contacts:", error);
        }
      }

      // Automatically assign role based on employee type (Member or Lead)
      let roleIdToAssign: string | null = null;
      if (formData.employeeType === "member" && employeeRoleId) {
        roleIdToAssign = employeeRoleId;
      } else if (formData.employeeType === "lead" && departmentLeadRoleId) {
        roleIdToAssign = departmentLeadRoleId;
      }

      // Assign the role
      if (roleIdToAssign) {
        try {
          await api.post(`/employees/${employeeId}/roles`, {
            roleIds: [roleIdToAssign]
          });
        } catch (error) {
          console.error("Failed to assign role:", error);
          toast.error("Employee created but failed to assign role. Please assign manually.");
        }
      } else {
        console.warn("Could not find role ID for employee type:", formData.employeeType);
        toast.warning("Employee created but role could not be assigned. Please assign manually.");
      }

      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("New employee hired successfully!");
      handleReset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create employee");
    },
  });

  const handleReset = () => {
    setFormData({
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
      departmentId: "",
      password: "",
      employeeType: "member",
      roleIds: [],
    });
    setEmergencyContacts([{ name: "", relationship: "", phone: "", email: "", isPrimary: true }]);
    setActiveTab("personal");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.employeeId || !formData.firstName || !formData.lastName || !formData.email || !formData.hireDate || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    createMutation.mutate(formData);
  };

  const addEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, { name: "", relationship: "", phone: "", email: "", isPrimary: false }]);
  };

  const removeEmergencyContact = (index: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: string | boolean) => {
    const updated = [...emergencyContacts];
    updated[index] = { ...updated[index], [field]: value };
    
    // If setting as primary, unset others
    if (field === "isPrimary" && value === true) {
      updated.forEach((contact, i) => {
        if (i !== index) contact.isPrimary = false;
      });
    }
    
    setEmergencyContacts(updated);
  };

  // Role toggle removed - roles are now auto-assigned based on employee type

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  const relationships = ["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Hire
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
              <TabsTrigger value="roles">Roles & Access</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Basic personal details of the new employee</CardDescription>
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
                        value={formData.phone}
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
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={formData.state}
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
                        value={formData.zipCode}
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
                  <CardDescription>Employment details and account setup</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employeeId">Employee ID *</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
                        placeholder="EMP001"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">Unique identifier for the employee</p>
                    </div>
                    <div>
                      <Label htmlFor="departmentId">Department *</Label>
                      <Select
                        value={formData.departmentId}
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Emergency Contacts Tab */}
            <TabsContent value="contacts" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                  <CardDescription>Add emergency contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <Card key={index} className="border-dashed">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-semibold">
                              Contact {index + 1}
                            </Label>
                            {contact.isPrimary && (
                              <Badge variant="default" className="text-xs">Primary</Badge>
                            )}
                          </div>
                          {emergencyContacts.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEmergencyContact(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Name *</Label>
                            <Input
                              value={contact.name}
                              onChange={(e) => updateEmergencyContact(index, "name", e.target.value)}
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <Label>Relationship *</Label>
                            <Select
                              value={contact.relationship}
                              onValueChange={(value) => updateEmergencyContact(index, "relationship", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                              <SelectContent>
                                {relationships.map((rel) => (
                                  <SelectItem key={rel} value={rel}>
                                    {rel}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Phone *</Label>
                            <Input
                              type="tel"
                              value={contact.phone}
                              onChange={(e) => updateEmergencyContact(index, "phone", e.target.value)}
                              placeholder="(555) 123-4567"
                            />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input
                              type="email"
                              value={contact.email}
                              onChange={(e) => updateEmergencyContact(index, "email", e.target.value)}
                              placeholder="email@example.com"
                            />
                          </div>
                        </div>

                        <div className="mt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={contact.isPrimary}
                              onChange={(e) => updateEmergencyContact(index, "isPrimary", e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-sm">Set as primary contact</span>
                          </label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEmergencyContact}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Contact
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Roles & Access Tab - Hidden, roles are auto-assigned based on employee type */}
            <TabsContent value="roles" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Role Assignment</CardTitle>
                  <CardDescription>Role will be automatically assigned based on employee type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <p className="font-medium mb-2">
                        {formData.employeeType === "member" ? "Employee Role" : "Department Lead Role"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formData.employeeType === "member" 
                          ? "This employee will be assigned the 'Employee' role, which allows them to view their own information only."
                          : "This employee will be assigned the 'Department Lead' role, which allows them to view their own information and all employees in their department (read-only)."}
                      </p>
                      {!formData.departmentId && (
                        <p className="text-sm text-amber-600 mt-2">
                          ⚠️ Please select a department first. Department Leads can only view employees in their assigned department.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => { handleReset(); onOpenChange(false); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create New Hire"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

