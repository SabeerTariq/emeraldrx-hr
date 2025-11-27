"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Clock, UserX, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function ManagerAttendanceReviewPage() {
  const [departmentId, setDepartmentId] = useState<string>("");
  const [startDate, setStartDate] = useState(format(new Date(new Date().setDate(new Date().getDate() - new Date().getDay())), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6)), "yyyy-MM-dd"));

  const { data, isLoading, error } = useQuery({
    queryKey: ["manager-attendance-review", departmentId, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (departmentId) params.append("departmentId", departmentId);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await api.get(`/attendance/manager-review?${params.toString()}`);
      return response.data.data;
    },
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await api.get("/departments");
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Manager Attendance Review</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Manager Attendance Review</h1>
        <div className="text-red-500">Error loading attendance data</div>
      </div>
    );
  }

  const reviewData = data || {
    lateEmployees: [],
    noShows: [],
    totalHours: [],
    weeklySummary: [],
    period: { start: startDate, end: endDate },
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Manager Attendance Review</h1>
        <p className="text-muted-foreground">Review late employees, no-shows, hours, and weekly summaries</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Departments</SelectItem>
                  {departments?.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Late Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewData.lateEmployees?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">No-Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewData.noShows?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewData.totalHours?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviewData.totalHours?.reduce((sum: number, emp: any) => sum + (parseFloat(emp.totalHours) || 0), 0).toFixed(1) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Late Employees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Late Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviewData.lateEmployees && reviewData.lateEmployees.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Late Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewData.lateEmployees.map((emp: any) => (
                    <TableRow key={emp.employeeId}>
                      <TableCell>
                        {emp.firstName} {emp.lastName}
                        <div className="text-sm text-muted-foreground">({emp.empId})</div>
                      </TableCell>
                      <TableCell>{emp.departmentName || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{emp.lateCount} times</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No late employees</div>
            )}
          </CardContent>
        </Card>

        {/* No-Shows */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-red-500" />
              No-Call/No-Shows
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviewData.noShows && reviewData.noShows.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Shift Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewData.noShows.map((noShow: any, index: number) => (
                    <TableRow key={`${noShow.employeeId}-${index}`}>
                      <TableCell>
                        {noShow.firstName} {noShow.lastName}
                        <div className="text-sm text-muted-foreground">({noShow.empId})</div>
                      </TableCell>
                      <TableCell>{format(new Date(noShow.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{format(new Date(noShow.startTime), "h:mm a")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No no-shows</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Total Hours */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Total Hours by Employee
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviewData.totalHours && reviewData.totalHours.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Clock-Ins</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewData.totalHours
                  .sort((a: any, b: any) => parseFloat(b.totalHours) - parseFloat(a.totalHours))
                  .map((emp: any) => (
                    <TableRow key={emp.employeeId}>
                      <TableCell>
                        {emp.firstName} {emp.lastName}
                        <div className="text-sm text-muted-foreground">({emp.empId})</div>
                      </TableCell>
                      <TableCell>{emp.departmentName || "N/A"}</TableCell>
                      <TableCell className="font-medium">
                        {parseFloat(emp.totalHours || 0).toFixed(2)} hrs
                      </TableCell>
                      <TableCell>{emp.attendanceCount || 0}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No attendance data</div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekly Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviewData.weeklySummary && reviewData.weeklySummary.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employees Present</TableHead>
                  <TableHead>Total Clock-Ins</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Late Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewData.weeklySummary.map((day: any) => (
                  <TableRow key={day.date}>
                    <TableCell>{format(new Date(day.date), "MMM d, yyyy (EEE)")}</TableCell>
                    <TableCell>{day.employeesPresent || 0}</TableCell>
                    <TableCell>{day.totalClockIns || 0}</TableCell>
                    <TableCell className="font-medium">
                      {parseFloat(day.totalHours || 0).toFixed(2)} hrs
                    </TableCell>
                    <TableCell>
                      {day.lateCount > 0 ? (
                        <Badge variant="destructive">{day.lateCount}</Badge>
                      ) : (
                        <Badge variant="default">0</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No weekly summary data</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

