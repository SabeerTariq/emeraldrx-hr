import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

/**
 * GET /api/notifications
 * Get notifications for user
 */
router.get("/", async (req, res) => {
  try {
    const { employeeId, unreadOnly } = req.query;
    
    let sql = `
      SELECT * FROM notifications WHERE employeeId = ?
    `;
    
    const params: any[] = [employeeId];
    
    if (unreadOnly === 'true') {
      sql += " AND isRead = 0";
    }
    
    sql += " ORDER BY createdAt DESC LIMIT 50";
    
    const notifications = await query(sql, params);
    res.json({ success: true, data: notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
router.put("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    
    await query(
      `UPDATE notifications SET isRead = 1, readAt = NOW() WHERE id = ?`,
      [id]
    );
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read for user
 */
router.put("/read-all", async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    await query(
      `UPDATE notifications SET isRead = 1, readAt = NOW() WHERE employeeId = ? AND isRead = 0`,
      [employeeId]
    );
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

