import express from "express";
import { query, transaction } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";

const router = express.Router();

/**
 * GET /api/pto/balance/:employeeId
 * Get PTO balance for an employee (current year)
 */
router.get("/balance/:employeeId", authenticate, requirePermission("pto:read"), async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentYear = new Date().getFullYear();

    // Convert employeeId (could be string ID like "EMP001" or UUID) to database UUID
    let employeeDbId = employeeId;
    if (!employeeId.includes('-')) {
      // It's a string employee ID, need to get the database UUID
      const employees = await query(
        `SELECT id FROM employees WHERE employeeId = ?`,
        [employeeId]
      ) as any[];
      
      if (employees.length === 0) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }
      
      employeeDbId = employees[0].id;
    }

    let balance = await query(
      `SELECT * FROM pto_balances 
       WHERE employeeId = ? AND year = ?`,
      [employeeDbId, currentYear]
    ) as any[];

    // If no balance exists, create one
    if (balance.length === 0) {
      const uuid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      const balanceId = uuid();
      await query(
        `INSERT INTO pto_balances 
         (id, employeeId, year, totalPtoBalance, rolloverHours, remainingBalance, createdAt, updatedAt)
         VALUES (?, ?, ?, 0, 0, 0, NOW(), NOW())`,
        [balanceId, employeeDbId, currentYear]
      );

      balance = await query(
        `SELECT * FROM pto_balances WHERE id = ?`,
        [balanceId]
      ) as any[];
    }

    res.json({ success: true, data: balance[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/pto/balance
 * Create or update PTO balance
 */
router.post("/balance", authenticate, requirePermission("pto:create"), async (req, res) => {
  try {
    const {
      employeeId,
      year,
      totalPtoBalance,
      rolloverHours,
    } = req.body;

    // Convert employeeId (could be string ID like "EMP001" or UUID) to database UUID
    let employeeDbId = employeeId;
    if (employeeId && !employeeId.includes('-')) {
      // It's a string employee ID, need to get the database UUID
      const employees = await query(
        `SELECT id FROM employees WHERE employeeId = ?`,
        [employeeId]
      ) as any[];
      
      if (employees.length === 0) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }
      
      employeeDbId = employees[0].id;
    }

    // Validate employee exists
    const employeeCheck = await query(
      `SELECT id FROM employees WHERE id = ?`,
      [employeeDbId]
    ) as any[];
    
    if (employeeCheck.length === 0) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    // Check if balance exists
    const existing = await query(
      `SELECT id FROM pto_balances WHERE employeeId = ? AND year = ?`,
      [employeeDbId, year]
    ) as any[];

    if (existing.length > 0) {
      // Update existing
      await query(
        `UPDATE pto_balances 
         SET totalPtoBalance = ?, 
             rolloverHours = ?,
             remainingBalance = totalPtoBalance + rolloverHours - usedHours,
             updatedAt = NOW()
         WHERE id = ?`,
        [totalPtoBalance || 0, rolloverHours || 0, existing[0].id]
      );
    } else {
      // Create new
      const balanceId = uuid();
      await query(
        `INSERT INTO pto_balances 
         (id, employeeId, year, totalPtoBalance, rolloverHours, remainingBalance, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          balanceId,
          employeeDbId,
          year,
          totalPtoBalance || 0,
          rolloverHours || 0,
          (totalPtoBalance || 0) + (rolloverHours || 0),
        ]
      );
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/pto/balance/:id/update-hours
 * Update PTO hours (when leave is approved/rejected)
 */
router.put("/balance/:id/update-hours", authenticate, requirePermission("pto:update"), async (req, res) => {
  try {
    const { id } = req.params;
    const { pendingHours, approvedHours, usedHours } = req.body;

    const updateFields: string[] = [];
    const params: any[] = [];

    if (pendingHours !== undefined) {
      updateFields.push("pendingHours = ?");
      params.push(pendingHours);
    }
    if (approvedHours !== undefined) {
      updateFields.push("approvedHours = ?");
      params.push(approvedHours);
    }
    if (usedHours !== undefined) {
      updateFields.push("usedHours = ?");
      params.push(usedHours);
    }

    // Recalculate remaining balance
    updateFields.push("remainingBalance = totalPtoBalance + rolloverHours - usedHours");
    updateFields.push("updatedAt = NOW()");
    params.push(id);

    await query(
      `UPDATE pto_balances SET ${updateFields.join(", ")} WHERE id = ?`,
      params
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/pto/reset
 * Reset PTO balances for new year (runs on January 1)
 * Transfers rollover hours based on configurable rules
 */
router.post("/reset", authenticate, requirePermission("pto:update"), async (req, res) => {
  try {
    const { year, rolloverLimit } = req.body;
    const newYear = year || new Date().getFullYear();
    const maxRollover = rolloverLimit || 8; // Default: 1 day = 8 hours

    await transaction(async (connection) => {
      // Get all employees with PTO balances from previous year
      const previousYear = newYear - 1;
      const balances = await connection.execute(
        `SELECT * FROM pto_balances WHERE year = ?`,
        [previousYear]
      ) as any[];

      for (const balance of balances[0]) {
        // Calculate rollover (max 1 day = 8 hours)
        const rolloverHours = Math.min(balance.remainingBalance || 0, maxRollover);

        const uuid = () => {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        };

        // Create new year balance with rollover
        const newBalanceId = uuid();
        await connection.execute(
          `INSERT INTO pto_balances 
           (id, employeeId, year, totalPtoBalance, rolloverHours, remainingBalance, createdAt, updatedAt)
           VALUES (?, ?, ?, 0, ?, ?, NOW(), NOW())`,
          [
            newBalanceId,
            balance.employeeId,
            newYear,
            rolloverHours,
            rolloverHours, // Initial remaining = rollover
          ]
        );
      }
    });

    res.json({ success: true, message: `PTO balances reset for year ${newYear}` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/pto/balance/:employeeId/history
 * Get PTO balance history for an employee
 */
router.get("/balance/:employeeId/history", authenticate, requirePermission("pto:read"), async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Convert employeeId (could be string ID like "EMP001" or UUID) to database UUID
    let employeeDbId = employeeId;
    if (!employeeId.includes('-')) {
      // It's a string employee ID, need to get the database UUID
      const employees = await query(
        `SELECT id FROM employees WHERE employeeId = ?`,
        [employeeId]
      ) as any[];
      
      if (employees.length === 0) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }
      
      employeeDbId = employees[0].id;
    }

    const history = await query(
      `SELECT * FROM pto_balances 
       WHERE employeeId = ? 
       ORDER BY year DESC`,
      [employeeDbId]
    ) as any[];

    res.json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/pto/calculate-leave-hours
 * Calculate hours for a leave request (1 day = 8 hours by default)
 */
router.post("/calculate-leave-hours", authenticate, requirePermission("pto:read"), async (req, res) => {
  try {
    const { startDate, endDate, hoursPerDay } = req.body;
    const hoursPerDayValue = hoursPerDay || 8;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate business days (excluding weekends)
    let days = 0;
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
        days++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const totalHours = days * hoursPerDayValue;

    res.json({ 
      success: true, 
      data: { 
        days, 
        hours: totalHours,
        hoursPerDay: hoursPerDayValue 
      } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

