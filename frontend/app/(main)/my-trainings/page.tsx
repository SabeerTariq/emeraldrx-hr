"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { getCurrentUser } from "@/lib/auth";

export default function MyTrainingsPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const user = getCurrentUser();
  const employeeId = user?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-trainings", employeeId, filterType, filterStatus],
    queryFn: async () => {
      if (!employeeId) return [];
      const params = new URLSearchParams();
      if (filterType !== "all") {
        params.append("trainingType", filterType);
      }
      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }
      const queryString = params.toString();
      const url = `/training/my-trainings${queryString ? `?${queryString}` : ""}`;
      const res = await api.get(url);
      return res.data.data;
    },
    enabled: !!employeeId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Trainings</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Trainings</h1>
        <div className="text-red-500">Error loading trainings</div>
      </div>
    );
  }

  const trainings = data || [];
  const pendingTrainings = trainings.filter((t: any) => t.status === "pending" || t.status === "overdue");
  const completedTrainings = trainings.filter((t: any) => t.status === "completed");
  const overdueTrainings = trainings.filter((t: any) => t.status === "overdue");

  const getStatusBadge = (status: string, dueDate?: string) => {
    if (status === "completed") {
      return (
        <Badge className="bg-green-500">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    }
    if (status === "overdue") {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Overdue
        </Badge>
      );
    }
    if (status === "pending") {
      const isDueSoon = dueDate && new Date(dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      return (
        <Badge variant={isDueSoon ? "default" : "secondary"}>
          <Clock className="h-3 w-3 mr-1" />
          {isDueSoon ? "Due Soon" : "Pending"}
        </Badge>
      );
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Trainings</h1>
        <p className="text-muted-foreground mt-1">View and track your assigned trainings</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Trainings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingTrainings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTrainings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTrainings.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Label>Type:</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Sexual Harassment">Sexual Harassment</SelectItem>
                  <SelectItem value="HIPAA">HIPAA</SelectItem>
                  <SelectItem value="Pharmacy Compliance">Pharmacy Compliance</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="SOP">SOP</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trainings Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Training Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {trainings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No trainings assigned yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Training Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainings.map((training: any) => (
                  <TableRow key={training.id}>
                    <TableCell className="font-medium">{training.trainingTitle}</TableCell>
                    <TableCell>{training.trainingType || "N/A"}</TableCell>
                    <TableCell>{training.category || "N/A"}</TableCell>
                    <TableCell>
                      {training.assignedDate
                        ? format(new Date(training.assignedDate), "MMM d, yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {training.dueDate
                        ? format(new Date(training.dueDate), "MMM d, yyyy")
                        : "No due date"}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(training.status, training.dueDate)}
                    </TableCell>
                    <TableCell>
                      {training.duration ? `${training.duration} min` : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Priority Section - Overdue and Due Soon */}
      {(overdueTrainings.length > 0 || pendingTrainings.some((t: any) => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        const now = new Date();
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 7 && daysUntilDue >= 0;
      })) && (
        <Card className="mt-6 border-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-600">⚠️ Action Required</CardTitle>
          </CardHeader>
          <CardContent>
            {overdueTrainings.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-red-600 mb-2">Overdue Trainings ({overdueTrainings.length})</h3>
                <ul className="list-disc list-inside space-y-1">
                  {overdueTrainings.map((training: any) => (
                    <li key={training.id} className="text-sm">
                      {training.trainingTitle} - Due: {training.dueDate ? format(new Date(training.dueDate), "MMM d, yyyy") : "N/A"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pendingTrainings.filter((t: any) => {
              if (!t.dueDate) return false;
              const dueDate = new Date(t.dueDate);
              const now = new Date();
              const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              return daysUntilDue <= 7 && daysUntilDue >= 0;
            }).length > 0 && (
              <div>
                <h3 className="font-semibold text-yellow-600 mb-2">Due Soon (Next 7 Days)</h3>
                <ul className="list-disc list-inside space-y-1">
                  {pendingTrainings
                    .filter((t: any) => {
                      if (!t.dueDate) return false;
                      const dueDate = new Date(t.dueDate);
                      const now = new Date();
                      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                      return daysUntilDue <= 7 && daysUntilDue >= 0;
                    })
                    .map((training: any) => (
                      <li key={training.id} className="text-sm">
                        {training.trainingTitle} - Due: {format(new Date(training.dueDate), "MMM d, yyyy")}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

