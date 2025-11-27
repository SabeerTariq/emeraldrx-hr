import express from "express";
import { query, transaction } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";

const router = express.Router();

/**
 * GET /api/leave
 * Get all leave requests
 */
router.get("/", authenticate, requirePermission("leave:read"), async (req, res) => {
  try {
    const { status, employeeId } = req.query;
    
    let sql = `
      SELECT 
        lr.*,
        e.firstName,
        e.lastName,
        e.employeeId,
        approver.firstName as approverFirstName,
        approver.lastName as approverLastName
      FROM leave_requests lr
      JOIN employees e ON lr.employeeId = e.id
      LEFT JOIN employees approver ON lr.approvedBy = approver.id
    `;
    
    const params: any[] = [];
    const conditions: string[] = [];
    
    if (status) {
      conditions.push("lr.status = ?");
      params.push(status);
    }
    
    if (employeeId) {
      conditions.push("lr.employeeId = ?");
      params.push(employeeId);
    }
    
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    
    sql += " ORDER BY lr.createdAt DESC";
    
    const leaves = await query(sql, params) as any[];
    res.json({ success: true, data: leaves });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/leave
 * Create leave request
 */
router.post("/", authenticate, requirePermission("leave:create"), async (req, res) => {
  try {
    const { employeeId, type, startDate, endDate, reason } = req.body;
    
    // Calculate days requested (business days only, excluding weekends)
    const start = new Date(startDate);
    const end = new Date(endDate);
    let days = 0;
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
        days++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const hoursPerDay = 8; // Default: 1 day = 8 hours
    const daysRequested = days;
    
    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const requestId = uuid();
    
    await query(
      `INSERT INTO leave_requests (id, employeeId, type, startDate, endDate, daysRequested, reason, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
      [requestId, employeeId, type, startDate, endDate, daysRequested, reason || null]
    );
    
    // Update PTO balance pending hours (for PTO and Sick Leave types)
    if (type === 'PTO' || type === 'Sick Leave') {
      // Convert employeeId (could be string ID like "EMP001" or UUID) to database UUID
      let employeeDbId = employeeId;
      if (employeeId && !employeeId.includes('-')) {
        // It's a string employee ID, need to get the database UUID
        const employees = await query(
          `SELECT id FROM employees WHERE employeeId = ?`,
          [employeeId]
        ) as any[];
        
        if (employees.length === 0) {
          return res.status(404).json({ success: false, error: "Employee not found" });
        }
        
        employeeDbId = employees[0].id;
      }

      // Validate employee exists
      const employeeCheck = await query(
        `SELECT id FROM employees WHERE id = ?`,
        [employeeDbId]
      ) as any[];
      
      if (employeeCheck.length === 0) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }

      const currentYear = new Date().getFullYear();
      const pendingHours = daysRequested * hoursPerDay;
      
      // Get or create PTO balance
      let balance = await query(
        `SELECT id, pendingHours FROM pto_balances WHERE employeeId = ? AND year = ?`,
        [employeeDbId, currentYear]
      ) as any[];
      
      if (balance.length === 0) {
        const balanceId = uuid();
        await query(
          `INSERT INTO pto_balances 
           (id, employeeId, year, totalPtoBalance, rolloverHours, pendingHours, remainingBalance, createdAt, updatedAt)
           VALUES (?, ?, ?, 0, 0, ?, 0, NOW(), NOW())`,
          [balanceId, employeeDbId, currentYear, pendingHours]
        );
      } else {
        await query(
          `UPDATE pto_balances 
           SET pendingHours = pendingHours + ?, updatedAt = NOW()
           WHERE id = ?`,
          [pendingHours, balance[0].id]
        );
      }
    }
    
    res.json({ success: true, data: { id: requestId, daysRequested } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/leave/:id/approve
 * Approve leave request
 */
router.put("/:id/approve", authenticate, requirePermission("leave:approve"), async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy, managerComments } = req.body;
    
    // Get leave request details
    const leaveRequest = await query(
      `SELECT * FROM leave_requests WHERE id = ?`,
      [id]
    ) as any[];
    
    if (leaveRequest.length === 0) {
      return res.status(404).json({ success: false, error: "Leave request not found" });
    }
    
    const request = leaveRequest[0];
    const hoursPerDay = 8;
    const approvedHours = (request.daysRequested || 0) * hoursPerDay;
    
    await transaction(async (connection) => {
      // Update leave request
      await connection.execute(
        `UPDATE leave_requests 
         SET status = 'approved', approvedBy = ?, approvedAt = NOW(), 
             managerComments = ?, updatedAt = NOW()
         WHERE id = ?`,
        [approvedBy, managerComments || null, id]
      );
      
      // Update PTO balance (for PTO and Sick Leave - merged into PTO)
      if (request.type === 'PTO' || request.type === 'Sick Leave') {
        const currentYear = new Date().getFullYear();
        
        // Get PTO balance
        const balance = await connection.execute(
          `SELECT id, pendingHours, approvedHours, usedHours, totalPtoBalance, rolloverHours
           FROM pto_balances WHERE employeeId = ? AND year = ?`,
          [request.employeeId, currentYear]
        ) as any[];
        
        if (balance.length > 0) {
          const bal = balance[0];
          const newPendingHours = Math.max(0, (bal.pendingHours || 0) - approvedHours);
          const newApprovedHours = (bal.approvedHours || 0) + approvedHours;
          const newUsedHours = (bal.usedHours || 0) + approvedHours;
          const newRemaining = (bal.totalPtoBalance || 0) + (bal.rolloverHours || 0) - newUsedHours;
          
          await connection.execute(
            `UPDATE pto_balances 
             SET pendingHours = ?, approvedHours = ?, usedHours = ?, 
                 remainingBalance = ?, updatedAt = NOW()
             WHERE id = ?`,
            [newPendingHours, newApprovedHours, newUsedHours, newRemaining, bal.id]
          );
        }
      }
    });
    
    // Notify employee
    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const notificationId = uuid();
    await query(
      `INSERT INTO notifications (id, employeeId, type, title, message, link, createdAt)
       VALUES (?, ?, 'leave_approved', ?, ?, ?, NOW())`,
      [
        notificationId,
        request.employeeId,
        "Leave Request Approved",
        `Your leave request from ${new Date(request.startDate).toLocaleDateString()} to ${new Date(request.endDate).toLocaleDateString()} has been approved.`,
        `/leave-management`,
      ]
    );
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/leave/:id/reject
 * Reject leave request
 */
router.put("/:id/reject", authenticate, requirePermission("leave:reject"), async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy, rejectionReason, managerComments } = req.body;
    
    // Get leave request details
    const leaveRequest = await query(
      `SELECT * FROM leave_requests WHERE id = ?`,
      [id]
    ) as any[];
    
    if (leaveRequest.length === 0) {
      return res.status(404).json({ success: false, error: "Leave request not found" });
    }
    
    const request = leaveRequest[0];
    const hoursPerDay = 8;
    const rejectedHours = (request.daysRequested || 0) * hoursPerDay;
    
    await transaction(async (connection) => {
      // Update leave request
      await connection.execute(
        `UPDATE leave_requests 
         SET status = 'rejected', approvedBy = ?, rejectionReason = ?, 
             managerComments = ?, updatedAt = NOW()
         WHERE id = ?`,
        [approvedBy, rejectionReason || null, managerComments || null, id]
      );
      
      // Remove pending hours from PTO balance (for PTO and Sick Leave)
      if (request.type === 'PTO' || request.type === 'Sick Leave') {
        const currentYear = new Date().getFullYear();
        
        const balance = await connection.execute(
          `SELECT id, pendingHours FROM pto_balances WHERE employeeId = ? AND year = ?`,
          [request.employeeId, currentYear]
        ) as any[];
        
        if (balance.length > 0) {
          const bal = balance[0];
          const newPendingHours = Math.max(0, (bal.pendingHours || 0) - rejectedHours);
          
          await connection.execute(
            `UPDATE pto_balances 
             SET pendingHours = ?, updatedAt = NOW()
             WHERE id = ?`,
            [newPendingHours, bal.id]
          );
        }
      }
    });
    
    // Notify employee
    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const notificationId = uuid();
    await query(
      `INSERT INTO notifications (id, employeeId, type, title, message, link, createdAt)
       VALUES (?, ?, 'leave_rejected', ?, ?, ?, NOW())`,
      [
        notificationId,
        request.employeeId,
        "Leave Request Rejected",
        `Your leave request from ${new Date(request.startDate).toLocaleDateString()} to ${new Date(request.endDate).toLocaleDateString()} was rejected. Reason: ${rejectionReason || 'Not specified'}`,
        `/leave-management`,
      ]
    );
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

