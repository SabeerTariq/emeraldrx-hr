import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

/**
 * GET /api/training
 * Get all training records
 */
router.get("/", async (req, res) => {
  try {
    const trainings = await query(`
      SELECT 
        etr.*,
        t.title as trainingTitle,
        t.category,
        t.duration,
        e.firstName,
        e.lastName,
        e.employeeId
      FROM employee_training_records etr
      JOIN trainings t ON etr.trainingId = t.id
      JOIN employees e ON etr.employeeId = e.id
      ORDER BY etr.dueDate
    `);
    
    res.json({ success: true, data: trainings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

