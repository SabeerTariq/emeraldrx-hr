import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

/**
 * GET /api/evaluations
 * Get all performance evaluations
 */
router.get("/", async (req, res) => {
  try {
    const { employeeId } = req.query;
    
    let sql = `
      SELECT 
        pe.*,
        e.firstName,
        e.lastName,
        e.employeeId,
        evaluator.firstName as evaluatorFirstName,
        evaluator.lastName as evaluatorLastName
      FROM performance_evaluations pe
      JOIN employees e ON pe.employeeId = e.id
      JOIN employees evaluator ON pe.evaluatorId = evaluator.id
    `;
    
    const params: any[] = [];
    if (employeeId) {
      sql += " WHERE pe.employeeId = ?";
      params.push(employeeId);
    }
    
    sql += " ORDER BY pe.createdAt DESC";
    
    const evaluations = await query(sql, params);
    res.json({ success: true, data: evaluations });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/evaluations
 * Create performance evaluation
 */
router.post("/", async (req, res) => {
  try {
    const { employeeId, period, evaluatorId, ratings, goals, notes, documentUrl } = req.body;
    
    const [result] = await query(
      `INSERT INTO performance_evaluations (id, employeeId, period, evaluatorId, ratings, goals, notes, documentUrl, createdAt, updatedAt)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        employeeId,
        period,
        evaluatorId,
        JSON.stringify(ratings || {}),
        JSON.stringify(goals || []),
        notes || null,
        documentUrl || null
      ]
    );
    
    res.json({ success: true, data: { id: (result as any).insertId } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

