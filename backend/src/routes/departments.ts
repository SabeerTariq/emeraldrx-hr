import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

/**
 * GET /api/departments
 * Get all departments
 */
router.get("/", async (req, res) => {
  try {
    const departments = await query(`
      SELECT id, name, description, createdAt, updatedAt
      FROM departments
      ORDER BY name
    `);
    
    res.json({ success: true, data: departments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

