import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics
 */
router.get("/stats", async (req, res) => {
  try {
    const [employees] = await query("SELECT COUNT(*) as count FROM employees WHERE isActive = 1");
    const [pendingApprovals] = await query("SELECT COUNT(*) as count FROM leave_requests WHERE status = 'pending'");
    const [licenseExpiries] = await query("SELECT COUNT(*) as count FROM licenses WHERE expiryDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY) AND isActive = 1");
    const [overdueTraining] = await query("SELECT COUNT(*) as count FROM employee_training_records WHERE status = 'overdue'");
    const [incidents] = await query("SELECT COUNT(*) as count FROM incidents WHERE status IN ('open', 'in_progress')");
    const [upcomingShifts] = await query("SELECT COUNT(*) as count FROM shifts WHERE date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)");

    res.json({
      success: true,
      data: {
        totalEmployees: employees.count,
        pendingApprovals: pendingApprovals.count,
        licenseExpiries: licenseExpiries.count,
        overdueTraining: overdueTraining.count,
        incidentsRequiringReview: incidents.count,
        upcomingShifts: upcomingShifts.count,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

