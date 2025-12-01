import express from "express";
import { query } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";

const router = express.Router();

/**
 * Middleware to check if clock-in is allowed from this IP/device
 */
const checkClockInDevice = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const deviceId = req.headers['x-device-id'] as string;
    
    // Check if device is whitelisted
    const deviceCheck = await query(
      `SELECT id FROM clock_in_devices 
       WHERE isActive = 1 
       AND (ipAddress = ? OR deviceId = ?)`,
      [ipAddress, deviceId || '']
    ) as any[];
    
    if (deviceCheck.length === 0 && process.env.NODE_ENV === 'production') {
      return res.status(403).json({ 
        success: false, 
        error: "Clock-in is only allowed from designated devices. Please contact IT to register your device." 
      });
    }
    
    // Store device info for logging
    (req as any).clockInDevice = {
      ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
      deviceId: deviceId || null,
    };
    
    next();
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/attendance/clock-in
 * Clock in for an employee
 */
router.post("/clock-in", authenticate, checkClockInDevice, async (req, res) => {
  try {
    let { employeeId, shiftAssignmentId, notes } = req.body;
    const deviceInfo = (req as any).clockInDevice;

    if (!employeeId) {
      return res.status(400).json({ success: false, error: "Employee ID is required" });
    }

    // Convert string employee ID (like "EMP001") to database UUID if needed
    if (employeeId && !employeeId.includes('-')) {
      // It's a string employee ID, need to get the database UUID
      const employees = await query(
        `SELECT id FROM employees WHERE employeeId = ?`,
        [employeeId]
      ) as any[];
      
      if (employees.length === 0) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }
      
      employeeId = employees[0].id;
    }

    // Validate employee exists
    const employeeCheck = await query(
      `SELECT id FROM employees WHERE id = ?`,
      [employeeId]
    ) as any[];
    
    if (employeeCheck.length === 0) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const attendanceId = uuid();
    const clockInTime = new Date();

    // Check if there's an open attendance log (clocked in but not out)
    const openLog = await query(
      `SELECT id FROM attendance_logs 
       WHERE employeeId = ? AND clockOut IS NULL 
       ORDER BY clockIn DESC LIMIT 1`,
      [employeeId]
    ) as any[];

    if (openLog.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: "You are already clocked in. Please clock out first." 
      });
    }

    // Check if late (if shift assignment exists)
    let isLate = false;
    if (shiftAssignmentId) {
      const shift = await query(
        `SELECT s.startTime 
         FROM shifts s
         JOIN shift_assignments sa ON s.id = sa.shiftId
         WHERE sa.id = ?`,
        [shiftAssignmentId]
      ) as any[];
      
      if (shift.length > 0 && new Date(shift[0].startTime) < clockInTime) {
        isLate = true;
      }

      // Update shift assignment clock-in
      await query(
        `UPDATE shift_assignments 
         SET clockIn = ?, status = 'confirmed', updatedAt = NOW()
         WHERE id = ?`,
        [clockInTime, shiftAssignmentId]
      );
    }

    // Create attendance log
    await query(
      `INSERT INTO attendance_logs 
       (id, employeeId, shiftAssignmentId, clockIn, ipAddress, deviceInfo, isLate, notes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        attendanceId,
        employeeId,
        shiftAssignmentId || null,
        clockInTime,
        deviceInfo.ipAddress,
        deviceInfo.deviceId || null,
        isLate ? 1 : 0,
        notes || null,
      ]
    );

    res.json({ 
      success: true, 
      data: { 
        id: attendanceId, 
        clockIn: clockInTime,
        isLate 
      } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/attendance/clock-out
 * Clock out for an employee
 */
router.post("/clock-out", authenticate, checkClockInDevice, async (req, res) => {
  try {
    let { employeeId, notes } = req.body;
    const deviceInfo = (req as any).clockInDevice;

    if (!employeeId) {
      return res.status(400).json({ success: false, error: "Employee ID is required" });
    }

    // Convert string employee ID (like "EMP001") to database UUID if needed
    if (employeeId && !employeeId.includes('-')) {
      // It's a string employee ID, need to get the database UUID
      const employees = await query(
        `SELECT id FROM employees WHERE employeeId = ?`,
        [employeeId]
      ) as any[];
      
      if (employees.length === 0) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }
      
      employeeId = employees[0].id;
    }

    // Validate employee exists
    const employeeCheck = await query(
      `SELECT id FROM employees WHERE id = ?`,
      [employeeId]
    ) as any[];
    
    if (employeeCheck.length === 0) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Find the most recent open attendance log
    const openLog = await query(
      `SELECT id, clockIn, shiftAssignmentId 
       FROM attendance_logs 
       WHERE employeeId = ? AND clockOut IS NULL 
       ORDER BY clockIn DESC LIMIT 1`,
      [employeeId]
    ) as any[];

    if (openLog.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "No active clock-in found. Please clock in first." 
      });
    }

    const log = openLog[0];
    const clockOutTime = new Date();
    const clockInTime = new Date(log.clockIn);
    
    // Calculate total hours
    const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);

    // Update attendance log
    await query(
      `UPDATE attendance_logs 
       SET clockOut = ?, totalHours = ?, notes = COALESCE(CONCAT(notes, '\n', ?), notes), updatedAt = NOW()
       WHERE id = ?`,
      [clockOutTime, totalHours, notes || null, log.id]
    );

    // Update shift assignment if exists
    if (log.shiftAssignmentId) {
      await query(
        `UPDATE shift_assignments 
         SET clockOut = ?, updatedAt = NOW()
         WHERE id = ?`,
        [clockOutTime, log.shiftAssignmentId]
      );
    }

    res.json({ 
      success: true, 
      data: { 
        clockOut: clockOutTime,
        totalHours: totalHours.toFixed(2)
      } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/attendance/logs
 * Get attendance logs with filters
 */
router.get("/logs", authenticate, requirePermission("attendance:read"), async (req, res) => {
  try {
    let { employeeId, startDate, endDate, departmentId } = req.query;

    // Convert string employee ID to database UUID if needed
    if (employeeId && typeof employeeId === 'string' && !employeeId.includes('-')) {
      const employees = await query(
        `SELECT id FROM employees WHERE employeeId = ?`,
        [employeeId]
      ) as any[];
      
      if (employees.length > 0) {
        employeeId = employees[0].id;
      }
    }

    let sql = `
      SELECT 
        al.*,
        e.firstName,
        e.lastName,
        e.employeeId,
        d.name as departmentName
      FROM attendance_logs al
      JOIN employees e ON al.employeeId = e.id
      LEFT JOIN departments d ON e.departmentId = d.id
      WHERE 1=1
    `;
    
    const params: any[] = [];

    if (employeeId) {
      sql += " AND al.employeeId = ?";
      params.push(employeeId);
    }

    if (startDate) {
      sql += " AND DATE(al.clockIn) >= ?";
      params.push(startDate);
    }

    if (endDate) {
      sql += " AND DATE(al.clockIn) <= ?";
      params.push(endDate);
    }

    if (departmentId) {
      sql += " AND e.departmentId = ?";
      params.push(departmentId);
    }

    sql += " ORDER BY al.clockIn DESC LIMIT 100";

    const logs = await query(sql, params) as any[];
    res.json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/attendance/manager-review
 * Get manager review data (late employees, no-shows, hours, weekly summaries)
 */
router.get("/manager-review", authenticate, requirePermission("attendance:read"), async (req, res) => {
  try {
    const { departmentId, startDate, endDate } = req.query;

    // Default to current week if no dates provided
    const start = startDate || new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().split('T')[0];
    const end = endDate || new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6)).toISOString().split('T')[0];

    let whereClause = "WHERE DATE(al.clockIn) BETWEEN ? AND ?";
    const params: any[] = [start, end];

    if (departmentId) {
      whereClause += " AND e.departmentId = ?";
      params.push(departmentId);
    }

    // Late employees
    const lateEmployees = await query(
      `SELECT 
        al.employeeId,
        e.firstName,
        e.lastName,
        e.employeeId as empId,
        d.name as departmentName,
        COUNT(*) as lateCount,
        MIN(al.clockIn) as firstLateClockIn
       FROM attendance_logs al
       JOIN employees e ON al.employeeId = e.id
       LEFT JOIN departments d ON e.departmentId = d.id
       ${whereClause}
       AND al.isLate = 1
       GROUP BY al.employeeId, e.firstName, e.lastName, e.employeeId, d.name
       ORDER BY lateCount DESC`,
      params
    ) as any[];

    // No-call/no-show (scheduled but no clock-in)
    const noShows = await query(
      `SELECT 
        sa.employeeId,
        e.firstName,
        e.lastName,
        e.employeeId as empId,
        d.name as departmentName,
        s.date,
        s.startTime,
        COUNT(*) as noShowCount
       FROM shift_assignments sa
       JOIN shifts s ON sa.shiftId = s.id
       JOIN employees e ON sa.employeeId = e.id
       LEFT JOIN departments d ON e.departmentId = d.id
       WHERE DATE(s.date) BETWEEN ? AND ?
         AND sa.status = 'scheduled'
         AND sa.clockIn IS NULL
         AND s.date < NOW()
         ${departmentId ? 'AND e.departmentId = ?' : ''}
       GROUP BY sa.employeeId, e.firstName, e.lastName, e.employeeId, d.name, s.date, s.startTime
       ORDER BY s.date DESC`,
      departmentId ? [start, end, departmentId] : [start, end]
    ) as any[];

    // Total hours per employee
    const totalHours = await query(
      `SELECT 
        al.employeeId,
        e.firstName,
        e.lastName,
        e.employeeId as empId,
        d.name as departmentName,
        SUM(al.totalHours) as totalHours,
        COUNT(*) as attendanceCount
       FROM attendance_logs al
       JOIN employees e ON al.employeeId = e.id
       LEFT JOIN departments d ON e.departmentId = d.id
       ${whereClause}
       AND al.clockOut IS NOT NULL
       GROUP BY al.employeeId, e.firstName, e.lastName, e.employeeId, d.name
       ORDER BY totalHours DESC`,
      params
    ) as any[];

    // Weekly summary
    const weeklySummary = await query(
      `SELECT 
        DATE(al.clockIn) as date,
        COUNT(DISTINCT al.employeeId) as employeesPresent,
        COUNT(*) as totalClockIns,
        SUM(al.totalHours) as totalHours,
        SUM(CASE WHEN al.isLate = 1 THEN 1 ELSE 0 END) as lateCount
       FROM attendance_logs al
       JOIN employees e ON al.employeeId = e.id
       ${whereClause}
       GROUP BY DATE(al.clockIn)
       ORDER BY date ASC`,
      params
    ) as any[];

    res.json({
      success: true,
      data: {
        lateEmployees,
        noShows,
        totalHours,
        weeklySummary,
        period: { start, end },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/attendance/current-status
 * Get current clock-in status for an employee
 */
router.get("/current-status/:employeeId", authenticate, requirePermission("attendance:read"), async (req, res) => {
  try {
    let { employeeId } = req.params;

    // Convert string employee ID to database UUID if needed
    if (employeeId && !employeeId.includes('-')) {
      const employees = await query(
        `SELECT id FROM employees WHERE employeeId = ?`,
        [employeeId]
      ) as any[];
      
      if (employees.length === 0) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }
      
      employeeId = employees[0].id;
    }

    const currentLog = await query(
      `SELECT * FROM attendance_logs 
       WHERE employeeId = ? AND clockOut IS NULL 
       ORDER BY clockIn DESC LIMIT 1`,
      [employeeId]
    ) as any[];

    if (currentLog.length === 0) {
      return res.json({ success: true, data: { isClockedIn: false } });
    }

    res.json({
      success: true,
      data: {
        isClockedIn: true,
        attendanceLog: currentLog[0],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

