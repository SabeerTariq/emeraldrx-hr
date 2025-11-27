import express from "express";
import { query } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";

const router = express.Router();

/**
 * GET /api/licenses
 * Get all licenses
 */
router.get("/", authenticate, requirePermission("licenses:read"), async (req, res) => {
  try {
    const licenses = await query(`
      SELECT 
        l.*,
        e.firstName,
        e.lastName,
        e.employeeId,
        DATEDIFF(l.expiryDate, CURDATE()) as daysUntilExpiry
      FROM licenses l
      JOIN employees e ON l.employeeId = e.id
      ORDER BY l.expiryDate
    `);
    
    res.json({ success: true, data: licenses });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/licenses
 * Create new license
 */
router.post("/", authenticate, requirePermission("licenses:create"), async (req, res) => {
  try {
    const { employeeId, type, licenseNumber, state, issueDate, expiryDate } = req.body;

    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    await query(
      `INSERT INTO licenses (id, employeeId, type, licenseNumber, state, issueDate, expiryDate, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [uuid(), employeeId, type, licenseNumber, state, issueDate, expiryDate]
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
