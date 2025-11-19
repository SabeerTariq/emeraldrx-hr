import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics
 */
router.get("/stats", async (req, res) => {
  try {
    const employees = await query("SELECT COUNT(*) as count FROM employees WHERE isActive = 1") as any[];
    const pendingApprovals = await query("SELECT COUNT(*) as count FROM leave_requests WHERE status = 'pending'") as any[];
    const licenseExpiries = await query("SELECT COUNT(*) as count FROM licenses WHERE expiryDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY) AND isActive = 1") as any[];
    const overdueTraining = await query("SELECT COUNT(*) as count FROM employee_training_records WHERE status = 'overdue'") as any[];
    const incidents = await query("SELECT COUNT(*) as count FROM incidents WHERE status IN ('open', 'in_progress')") as any[];
    const upcomingShifts = await query("SELECT COUNT(*) as count FROM shifts WHERE date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)") as any[];

    res.json({
      success: true,
      data: {
        totalEmployees: employees[0]?.count || 0,
        pendingApprovals: pendingApprovals[0]?.count || 0,
        licenseExpiries: licenseExpiries[0]?.count || 0,
        overdueTraining: overdueTraining[0]?.count || 0,
        incidentsRequiringReview: incidents[0]?.count || 0,
        upcomingShifts: upcomingShifts[0]?.count || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

