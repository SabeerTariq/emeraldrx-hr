import express from "express";
import { query, transaction } from "../config/database.js";

const router = express.Router();

/**
 * GET /api/scheduling/shifts
 * Get all shifts with assignments
 */
router.get("/shifts", async (req, res) => {
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
    
    const shifts = await query(sql, params);
    res.json({ success: true, data: shifts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/scheduling/conflicts
 * Check for scheduling conflicts
 */
router.get("/conflicts", async (req, res) => {
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
    ]);
    
    res.json({ success: true, data: conflicts, hasConflict: conflicts.length > 0 });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scheduling/shifts
 * Create a new shift
 */
router.post("/shifts", async (req, res) => {
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
 * POST /api/scheduling/assign
 * Assign employee to shift
 */
router.post("/assign", async (req, res) => {
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

