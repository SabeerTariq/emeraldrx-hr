"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LicenseModal } from "@/components/modals/LicenseModal";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { hasPermission, getUserPermissions } from "@/lib/permissions";

export default function LicensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user permissions
  const { data: permissions } = useQuery({
    queryKey: ["user-permissions"],
    queryFn: getUserPermissions,
  });

  const canCreate = permissions && hasPermission(permissions, "licenses", "create");

  const { data, isLoading, error } = useQuery({
    queryKey: ["licenses"],
    queryFn: async () => {
      const response = await api.get("/licenses");
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Licenses & Certifications</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Licenses & Certifications</h1>
        <div className="text-red-500">Error loading licenses</div>
      </div>
    );
  }

  const licenses = data || [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Licenses & Certifications</h1>
        {canCreate && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add License
          </Button>
        )}
      </div>
      
      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>License Number</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licenses.map((license: any) => {
              const daysUntilExpiry = license.daysUntilExpiry;
              const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 90 && daysUntilExpiry >= 0;
              const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;
              
              return (
                <TableRow key={license.id}>
                  <TableCell>
                    {license.firstName} {license.lastName} ({license.employeeId})
                  </TableCell>
                  <TableCell>{license.type}</TableCell>
                  <TableCell className="font-mono">{license.licenseNumber}</TableCell>
                  <TableCell>{license.state}</TableCell>
                  <TableCell>{format(new Date(license.expiryDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    {daysUntilExpiry !== null ? (
                      <Badge
                        variant={
                          isExpired ? "destructive" : isExpiringSoon ? "default" : "secondary"
                        }
                      >
                        {isExpired
                          ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                          : `${daysUntilExpiry} days`}
                      </Badge>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {licenses.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">No licenses found</div>
        )}
      </div>

      <LicenseModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
