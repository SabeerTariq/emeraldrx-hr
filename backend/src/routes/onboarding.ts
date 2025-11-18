import express from "express";
import { query, transaction } from "../config/database.js";

const router = express.Router();

/**
 * GET /api/onboarding/tasks
 * Get all onboarding tasks
 */
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await query(`
      SELECT * FROM onboarding_tasks ORDER BY \`order\`
    `);
    res.json({ success: true, data: tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/onboarding/employees/:employeeId
 * Get onboarding tasks for specific employee
 */
router.get("/employees/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const tasks = await query(`
      SELECT 
        ot.*,
        eot.id as employeeTaskId,
        eot.status,
        eot.completedAt,
        eot.notes
      FROM onboarding_tasks ot
      LEFT JOIN employee_onboarding_tasks eot ON ot.id = eot.taskId AND eot.employeeId = ?
      ORDER BY ot.\`order\`
    `, [employeeId]);
    
    res.json({ success: true, data: tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/onboarding/employees/:employeeId/tasks
 * Assign onboarding tasks to employee
 */
router.post("/employees/:employeeId/tasks", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { taskIds } = req.body;
    
    await transaction(async (connection) => {
      for (const taskId of taskIds) {
        await connection.execute(
          `INSERT INTO employee_onboarding_tasks (id, employeeId, taskId, status, createdAt, updatedAt)
           VALUES (UUID(), ?, ?, 'pending', NOW(), NOW())
           ON DUPLICATE KEY UPDATE status = 'pending'`,
          [employeeId, taskId]
        );
      }
    });
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/onboarding/tasks/:taskId/complete
 * Mark onboarding task as complete
 */
router.put("/tasks/:taskId/complete", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { employeeId, notes } = req.body;
    
    await query(
      `UPDATE employee_onboarding_tasks 
       SET status = 'completed', completedAt = NOW(), notes = ?, updatedAt = NOW()
       WHERE taskId = ? AND employeeId = ?`,
      [notes || null, taskId, employeeId]
    );
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

