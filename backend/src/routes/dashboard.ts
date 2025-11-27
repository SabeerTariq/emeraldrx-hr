import express from "express";
import { query } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics based on user role and permissions
 */
router.get("/stats", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const employeeId = user.id;
    
    // Get user's roles
    const roles = await query(
      `SELECT r.name, r.permissions
       FROM employee_roles er
       JOIN roles r ON er.roleId = r.id
       WHERE er.employeeId = ?`,
      [employeeId]
    ) as any[];

    // Get individual employee permissions (if any)
    const employeePermsRows = await query(
      `SELECT permissions FROM employee_permissions WHERE employeeId = ?`,
      [employeeId]
    ) as any[];
    
    const individualPermissions = employeePermsRows && employeePermsRows.length > 0
      ? (typeof employeePermsRows[0].permissions === 'string' 
          ? JSON.parse(employeePermsRows[0].permissions) 
          : employeePermsRows[0].permissions)
      : null;

    // Merge permissions
    const mergedPermissions: Record<string, string[]> = individualPermissions 
      ? JSON.parse(JSON.stringify(individualPermissions))
      : {};
    
    for (const role of roles) {
      const permissions = typeof role.permissions === 'string' 
        ? JSON.parse(role.permissions) 
        : role.permissions;
      
      for (const [module, actions] of Object.entries(permissions)) {
        if (Array.isArray(actions)) {
          if (individualPermissions && individualPermissions[module]) {
            continue; // Individual permissions override
          }
          if (!mergedPermissions[module]) {
            mergedPermissions[module] = [];
          }
          actions.forEach((action: string) => {
            if (!mergedPermissions[module].includes(action)) {
              mergedPermissions[module].push(action);
            }
          });
        }
      }
    }

    // If user has no roles, return empty dashboard
    if (!roles || roles.length === 0) {
      return res.json({
        success: true,
        data: {
          role: "Employee",
          permissions: {},
        },
      });
    }

    const roleNames = roles.map((r: any) => r.name);
    const isAdmin = roleNames.includes("Admin");
    const isHR = roleNames.includes("HR");
    const isEmployee = roleNames.includes("Employee");
    
    // Get employee info for employee-specific data
    const employeeDataRows = await query(
      `SELECT id, employeeId, firstName, lastName, departmentId, designation
       FROM employees WHERE id = ?`,
      [employeeId]
    ) as any[];
    
    const employeeData = employeeDataRows && employeeDataRows.length > 0 ? employeeDataRows[0] : null;

    const dashboardData: any = {};

    // Admin Dashboard - Full access to all stats
    if (isAdmin) {
      const employees = await query("SELECT COUNT(*) as count FROM employees WHERE isActive = 1") as any[];
      const pendingApprovals = await query("SELECT COUNT(*) as count FROM leave_requests WHERE status = 'pending'") as any[];
      const licenseExpiries = await query("SELECT COUNT(*) as count FROM licenses WHERE expiryDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY) AND isActive = 1") as any[];
      const pharmacyLicenseExpiries = await query("SELECT COUNT(*) as count FROM pharmacy_licenses WHERE expirationDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY)") as any[];
      const overdueTraining = await query("SELECT COUNT(*) as count FROM employee_training_records WHERE status = 'overdue'") as any[];
      const upcomingShifts = await query("SELECT COUNT(*) as count FROM shifts WHERE date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)") as any[];
      const pendingDocuments = await query("SELECT COUNT(*) as count FROM employee_document_uploads WHERE approvalStatus = 'pending'") as any[];

      dashboardData.totalEmployees = employees[0]?.count || 0;
      dashboardData.pendingApprovals = pendingApprovals[0]?.count || 0;
      dashboardData.licenseExpiries = licenseExpiries[0]?.count || 0;
      dashboardData.pharmacyLicenseExpiries = pharmacyLicenseExpiries[0]?.count || 0;
      dashboardData.overdueTraining = overdueTraining[0]?.count || 0;
      dashboardData.upcomingShifts = upcomingShifts[0]?.count || 0;
      dashboardData.pendingDocuments = pendingDocuments[0]?.count || 0;
    }
    // HR Dashboard
    else if (isHR) {
      const pendingApprovals = await query("SELECT COUNT(*) as count FROM leave_requests WHERE status = 'pending'") as any[];
      const licenseExpiries = await query("SELECT COUNT(*) as count FROM licenses WHERE expiryDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY) AND isActive = 1") as any[];
      const overdueTraining = await query("SELECT COUNT(*) as count FROM employee_training_records WHERE status = 'overdue'") as any[];
      const pendingDocuments = await query("SELECT COUNT(*) as count FROM employee_document_uploads WHERE approvalStatus = 'pending'") as any[];
      const recentHires = await query("SELECT COUNT(*) as count FROM employees WHERE hireDate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)") as any[];

      dashboardData.pendingApprovals = pendingApprovals[0]?.count || 0;
      dashboardData.licenseExpiries = licenseExpiries[0]?.count || 0;
      dashboardData.overdueTraining = overdueTraining[0]?.count || 0;
      dashboardData.pendingDocuments = pendingDocuments[0]?.count || 0;
      dashboardData.recentHires = recentHires[0]?.count || 0;
    }
    // Employee Dashboard - Personal information
    else if (isEmployee && employeeData) {
      // Get employee's own data
      const myUpcomingShifts = await query(
        `SELECT COUNT(*) as count 
         FROM shift_assignments sa
         JOIN shifts s ON sa.shiftId = s.id
         WHERE sa.employeeId = ? AND s.date >= CURDATE() AND s.date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)`,
        [employeeId]
      ) as any[];

      const myPendingLeave = await query(
        `SELECT COUNT(*) as count FROM leave_requests WHERE employeeId = ? AND status = 'pending'`,
        [employeeId]
      ) as any[];

      const myOverdueTraining = await query(
        `SELECT COUNT(*) as count 
         FROM employee_training_records 
         WHERE employeeId = ? AND status = 'overdue'`,
        [employeeId]
      ) as any[];

      const myPendingDocuments = await query(
        `SELECT COUNT(*) as count 
         FROM employee_document_uploads 
         WHERE employeeId = ? AND approvalStatus = 'pending'`,
        [employeeId]
      ) as any[];

      const myExpiringLicenses = await query(
        `SELECT COUNT(*) as count 
         FROM licenses 
         WHERE employeeId = ? AND expiryDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY) AND isActive = 1`,
        [employeeId]
      ) as any[];

      // Get hours worked this week
      const hoursThisWeek = await query(
        `SELECT COALESCE(SUM(totalHours), 0) as totalHours
         FROM attendance_logs
         WHERE employeeId = ? 
         AND DATE(clockIn) >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
         AND DATE(clockIn) <= CURDATE()
         AND clockOut IS NOT NULL`,
        [employeeId]
      ) as any[];

      dashboardData.myUpcomingShifts = myUpcomingShifts[0]?.count || 0;
      dashboardData.myPendingLeave = myPendingLeave[0]?.count || 0;
      dashboardData.myOverdueTraining = myOverdueTraining[0]?.count || 0;
      dashboardData.myPendingDocuments = myPendingDocuments[0]?.count || 0;
      dashboardData.myExpiringLicenses = myExpiringLicenses[0]?.count || 0;
      dashboardData.hoursThisWeek = hoursThisWeek[0]?.totalHours || 0;
      dashboardData.employeeName = `${employeeData.firstName} ${employeeData.lastName}`;
      dashboardData.designation = employeeData.designation || "Employee";
    }

    dashboardData.role = isAdmin ? "Admin" : isHR ? "HR" : "Employee";
    dashboardData.permissions = mergedPermissions;

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

