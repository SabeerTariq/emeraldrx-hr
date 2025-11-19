import express from "express";
import { query, transaction } from "../config/database.js";

const router = express.Router();

/**
 * GET /api/leave
 * Get all leave requests
 */
router.get("/", async (req, res) => {
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
router.post("/", async (req, res) => {
  try {
    const { employeeId, type, startDate, endDate, reason } = req.body;
    
    const result = await query(
      `INSERT INTO leave_requests (id, employeeId, type, startDate, endDate, reason, status, createdAt, updatedAt)
       VALUES (UUID(), ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
      [employeeId, type, startDate, endDate, reason || null]
    ) as any;
    
    res.json({ success: true, data: { id: result.insertId } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/leave/:id/approve
 * Approve leave request
 */
router.put("/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;
    
    await query(
      `UPDATE leave_requests 
       SET status = 'approved', approvedBy = ?, approvedAt = NOW(), updatedAt = NOW()
       WHERE id = ?`,
      [approvedBy, id]
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
router.put("/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy, rejectionReason } = req.body;
    
    await query(
      `UPDATE leave_requests 
       SET status = 'rejected', approvedBy = ?, rejectionReason = ?, updatedAt = NOW()
       WHERE id = ?`,
      [approvedBy, rejectionReason || null, id]
    );
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

