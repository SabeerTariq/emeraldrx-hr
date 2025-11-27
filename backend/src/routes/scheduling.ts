import express from "express";
import { query, transaction } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";

const router = express.Router();

/**
 * GET /api/scheduling/shifts
 * Get all shifts with assignments
 */
router.get("/shifts", authenticate, requirePermission("scheduling:read"), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let sql = `
      SELECT 
        s.*,
        d.name as departmentName,
        GROUP_CONCAT(
          CONCAT(e.firstName, ' ', e.lastName, ' (', e.employeeId, ')') 
          SEPARATOR ', '
        ) as assignedEmployees,
        COUNT(sa.id) as assignmentCount
      FROM shifts s
      LEFT JOIN departments d ON s.departmentId = d.id
      LEFT JOIN shift_assignments sa ON s.id = sa.shiftId
      LEFT JOIN employees e ON sa.employeeId = e.id
    `;
    
    const params: any[] = [];
    if (startDate && endDate) {
      sql += ` WHERE s.date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }
    
    sql += ` GROUP BY s.id ORDER BY s.date, s.startTime`;
    
    const shifts = await query(sql, params) as any[];
    res.json({ success: true, data: shifts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/scheduling/conflicts
 * Check for scheduling conflicts
 */
router.get("/conflicts", authenticate, requirePermission("scheduling:read"), async (req, res) => {
  try {
    const { employeeId, startTime, endTime, date, excludeShiftId } = req.query;
    
    const conflicts = await query(`
      SELECT s.*, e.firstName, e.lastName, e.employeeId
      FROM shifts s
      JOIN shift_assignments sa ON s.id = sa.shiftId
      JOIN employees e ON sa.employeeId = e.id
      WHERE sa.employeeId = ?
        AND s.date = ?
        AND s.id != ?
        AND (
          (s.startTime < ? AND s.endTime > ?) OR
          (s.startTime < ? AND s.endTime > ?) OR
          (s.startTime >= ? AND s.endTime <= ?)
        )
    `, [
      employeeId,
      date,
      excludeShiftId || '',
      startTime, startTime,
      endTime, endTime,
      startTime, endTime
    ]) as any[];
    
    res.json({ success: true, data: conflicts, hasConflict: conflicts.length > 0 });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scheduling/shifts
 * Create a new shift
 */
router.post("/shifts", authenticate, requirePermission("scheduling:create"), async (req, res) => {
  try {
    const { date, startTime, endTime, departmentId, notes, employeeIds } = req.body;
    
    await transaction(async (connection) => {
      const shiftId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      
      await connection.execute(
        `INSERT INTO shifts (id, date, startTime, endTime, departmentId, notes, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [shiftId, date, startTime, endTime, departmentId || null, notes || null]
      );
      
      // Assign employees if provided
      if (employeeIds && Array.isArray(employeeIds)) {
        for (const empId of employeeIds) {
          const assignmentId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
          await connection.execute(
            `INSERT INTO shift_assignments (id, shiftId, employeeId, status, createdAt, updatedAt)
             VALUES (?, ?, ?, 'scheduled', NOW(), NOW())`,
            [assignmentId, shiftId, empId]
          );
        }
      }
      
      res.json({ success: true, data: { id: shiftId } });
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/scheduling/shifts/:id
 * Get a specific shift with assignments
 */
router.get("/shifts/:id", authenticate, requirePermission("scheduling:read"), async (req, res) => {
  try {
    const { id } = req.params;
    
    const shifts = await query(`
      SELECT 
        s.*,
        d.name as departmentName,
        GROUP_CONCAT(
          CONCAT(e.firstName, ' ', e.lastName, ' (', e.employeeId, ')') 
          SEPARATOR ', '
        ) as assignedEmployees
      FROM shifts s
      LEFT JOIN departments d ON s.departmentId = d.id
      LEFT JOIN shift_assignments sa ON s.id = sa.shiftId
      LEFT JOIN employees e ON sa.employeeId = e.id
      WHERE s.id = ?
      GROUP BY s.id
    `, [id]) as any[];
    
    if (shifts.length === 0) {
      return res.status(404).json({ success: false, error: "Shift not found" });
    }
    
    res.json({ success: true, data: shifts[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/scheduling/shifts/:id/assignments
 * Get shift assignments for a specific shift
 */
router.get("/shifts/:id/assignments", authenticate, requirePermission("scheduling:read"), async (req, res) => {
  try {
    const { id } = req.params;
    
    const assignments = await query(`
      SELECT sa.*, e.firstName, e.lastName, e.employeeId
      FROM shift_assignments sa
      JOIN employees e ON sa.employeeId = e.id
      WHERE sa.shiftId = ?
    `, [id]) as any[];
    
    res.json({ success: true, data: assignments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/scheduling/shifts/:id
 * Update a shift
 */
router.put("/shifts/:id", authenticate, requirePermission("scheduling:update"), async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, departmentId, notes, employeeIds } = req.body;
    
    await transaction(async (connection) => {
      // Update shift
      await connection.execute(
        `UPDATE shifts 
         SET date = ?, startTime = ?, endTime = ?, departmentId = ?, notes = ?, updatedAt = NOW()
         WHERE id = ?`,
        [date, startTime, endTime, departmentId || null, notes || null, id]
      );
      
      // Remove existing assignments
      await connection.execute(
        `DELETE FROM shift_assignments WHERE shiftId = ?`,
        [id]
      );
      
      // Add new assignments if provided
      if (employeeIds && Array.isArray(employeeIds)) {
        for (const empId of employeeIds) {
          const assignmentId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
          await connection.execute(
            `INSERT INTO shift_assignments (id, shiftId, employeeId, status, createdAt, updatedAt)
             VALUES (?, ?, ?, 'scheduled', NOW(), NOW())`,
            [assignmentId, id, empId]
          );
        }
      }
    });
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/scheduling/shifts/:id
 * Delete a shift
 */
router.delete("/shifts/:id", authenticate, requirePermission("scheduling:delete"), async (req, res) => {
  try {
    const { id } = req.params;
    
    await query(
      `DELETE FROM shifts WHERE id = ?`,
      [id]
    );
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scheduling/assign
 * Assign employee to shift
 */
router.post("/assign", authenticate, requirePermission("scheduling:update"), async (req, res) => {
  try {
    const { shiftId, employeeId } = req.body;
    
    await query(
      `INSERT INTO shift_assignments (id, shiftId, employeeId, status, createdAt, updatedAt)
       VALUES (UUID(), ?, ?, 'scheduled', NOW(), NOW())
       ON DUPLICATE KEY UPDATE status = 'scheduled'`,
      [shiftId, employeeId]
    );
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

