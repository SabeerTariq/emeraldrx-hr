import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

/**
 * GET /api/roles
 * Get all roles
 */
router.get("/", async (req, res) => {
  try {
    const roles = await query(`
      SELECT id, name, description, permissions, createdAt, updatedAt
      FROM roles
      ORDER BY name
    `);
    
    res.json({ success: true, data: roles });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

