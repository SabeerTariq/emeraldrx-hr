"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AttendancePage() {
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  
  // Get current employee ID from localStorage or context (for demo, using a default)
  useEffect(() => {
    // In production, get from auth context
    const storedEmployeeId = localStorage.getItem("employeeId");
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId);
    } else {
      // Demo: use first employee ID
      setEmployeeId("f50c3257-7329-4cbb-b21c-beddc84a3455");
    }
  }, []);

  const { data: currentStatus, refetch: refetchStatus } = useQuery({
    queryKey: ["attendance-current-status", employeeId],
    queryFn: async () => {
      if (!employeeId) return null;
      const response = await api.get(`/attendance/current-status/${employeeId}`);
      return response.data.data;
    },
    enabled: !!employeeId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: attendanceLogs, isLoading } = useQuery({
    queryKey: ["attendance-logs", employeeId],
    queryFn: async () => {
      if (!employeeId) return [];
      const response = await api.get(`/attendance/logs?employeeId=${employeeId}&startDate=${format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd")}`);
      return response.data.data;
    },
    enabled: !!employeeId,
  });

  const queryClient = useQueryClient();

  const clockInMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/attendance/clock-in", {
        employeeId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-current-status", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["attendance-logs", employeeId] });
      toast.success("Clocked in successfully");
      refetchStatus();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to clock in. Please ensure you're using a designated device.");
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/attendance/clock-out", {
        employeeId,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendance-current-status", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["attendance-logs", employeeId] });
      toast.success(`Clocked out successfully. Total hours: ${data.data.totalHours}`);
      refetchStatus();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to clock out");
    },
  });

  const isClockedIn = currentStatus?.isClockedIn || false;
  const currentLog = currentStatus?.attendanceLog;

  // Calculate hours worked today
  const todayLogs = attendanceLogs?.filter((log: any) => {
    const logDate = format(new Date(log.clockIn), "yyyy-MM-dd");
    const today = format(new Date(), "yyyy-MM-dd");
    return logDate === today && log.clockOut;
  }) || [];

  const totalHoursToday = todayLogs.reduce((sum: number, log: any) => {
    return sum + (parseFloat(log.totalHours) || 0);
  }, 0);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Attendance & Clock-In</h1>
        <p className="text-muted-foreground">Clock in and out, view your attendance history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Clock-In/Out Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Clock In / Clock Out</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isClockedIn && currentLog ? (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Currently Clocked In</AlertTitle>
                  <AlertDescription>
                    You clocked in at {format(new Date(currentLog.clockIn), "MMM d, yyyy 'at' h:mm a")}
                    {currentLog.isLate && (
                      <Badge variant="destructive" className="ml-2">Late</Badge>
                    )}
                  </AlertDescription>
                </Alert>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Clock In Time:</span>
                    <span className="font-medium">{format(new Date(currentLog.clockIn), "h:mm a")}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {Math.floor((Date.now() - new Date(currentLog.clockIn).getTime()) / (1000 * 60))} minutes
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => clockOutMutation.mutate()}
                  disabled={clockOutMutation.isPending}
                  className="w-full"
                  size="lg"
                  variant="destructive"
                >
                  <Clock className="mr-2 h-5 w-5" />
                  {clockOutMutation.isPending ? "Clocking Out..." : "Clock Out"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Not Clocked In</AlertTitle>
                  <AlertDescription>
                    Click the button below to clock in. Clock-in is only allowed from designated devices.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={() => clockInMutation.mutate()}
                  disabled={clockInMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  <Clock className="mr-2 h-5 w-5" />
                  {clockInMutation.isPending ? "Clocking In..." : "Clock In"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Hours Today</div>
              <div className="text-3xl font-bold">{totalHoursToday.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Clock-Ins Today</div>
              <div className="text-2xl font-semibold">{todayLogs.length}</div>
            </div>
            {isClockedIn && (
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-1">Current Session</div>
                <div className="text-lg font-semibold text-primary">Active</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading attendance history...</div>
          ) : attendanceLogs && attendanceLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceLogs.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell>{format(new Date(log.clockIn), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(log.clockIn), "h:mm a")}</TableCell>
                    <TableCell>
                      {log.clockOut ? format(new Date(log.clockOut), "h:mm a") : (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.totalHours ? `${parseFloat(log.totalHours).toFixed(2)} hrs` : "-"}
                    </TableCell>
                    <TableCell>
                      {log.isLate && <Badge variant="destructive" className="mr-1">Late</Badge>}
                      {log.isNoShow && <Badge variant="destructive">No Show</Badge>}
                      {!log.isLate && !log.isNoShow && log.clockOut && (
                        <Badge variant="default">On Time</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No attendance records found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

