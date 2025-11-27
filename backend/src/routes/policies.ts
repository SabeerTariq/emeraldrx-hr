import express from "express";
import { query } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";

const router = express.Router();

/**
 * GET /api/policies
 * Get all policies
 */
router.get("/", authenticate, requirePermission("policies:read"), async (req, res) => {
  try {
    const policies = await query(`
      SELECT * FROM policies WHERE isActive = 1 ORDER BY createdAt DESC
    `);
    res.json({ success: true, data: policies });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/policies/:id/acknowledgments
 * Get policy acknowledgments
 */
router.get("/:id/acknowledgments", authenticate, requirePermission("policies:read"), async (req, res) => {
  try {
    const { id } = req.params;
    
    const acks = await query(`
      SELECT 
        epa.*,
        e.firstName,
        e.lastName,
        e.employeeId
      FROM employee_policy_acks epa
      JOIN employees e ON epa.employeeId = e.id
      WHERE epa.policyId = ?
      ORDER BY epa.acknowledgedAt DESC
    `, [id]);
    
    res.json({ success: true, data: acks });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/policies/:id/acknowledge
 * Acknowledge policy
 */
router.post("/:id/acknowledge", authenticate, requirePermission("policies:read"), async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, ipAddress } = req.body;
    
    await query(
      `INSERT INTO employee_policy_acks (id, employeeId, policyId, acknowledgedAt, ipAddress, createdAt)
       VALUES (UUID(), ?, ?, NOW(), ?, NOW())
       ON DUPLICATE KEY UPDATE acknowledgedAt = NOW()`,
      [employeeId, id, ipAddress || null]
    );
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

