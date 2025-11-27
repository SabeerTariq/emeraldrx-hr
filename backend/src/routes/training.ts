import express from "express";
import { query } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";

const router = express.Router();

/**
 * GET /api/training
 * Get all training records with optional filters
 */
router.get("/", authenticate, requirePermission("training:read"), async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    const currentUser = (req as any).user;
    const currentUserId = currentUser?.id;

    // Get user's roles from JWT token to check permissions
    const roleNames = currentUser?.roles || [];
    const isAdmin = roleNames.includes("Admin");
    const isHR = roleNames.includes("HR");
    const canViewAll = isAdmin || isHR;

    let sql = `
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
      WHERE 1=1
    `;
    
    const params: any[] = [];

    // Security: If not Admin/HR, restrict to current user's trainings only
    if (!canViewAll) {
      // Employees can only view their own trainings
      sql += " AND etr.employeeId = ?";
      params.push(currentUserId);
    } else if (employeeId) {
      // Admin/HR can filter by any employeeId
      sql += " AND etr.employeeId = ?";
      params.push(employeeId);
    }

    if (status) {
      sql += " AND etr.status = ?";
      params.push(status);
    }

    sql += " ORDER BY etr.dueDate";

    const trainings = await query(sql, params);
    
    res.json({ success: true, data: trainings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/training/modules
 * Get all training modules (templates)
 */
router.get("/modules", authenticate, requirePermission("training:read"), async (req, res) => {
  try {
    const modules = await query(`
      SELECT * FROM trainings
      ORDER BY title
    `);
    
    res.json({ success: true, data: modules });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/training/modules
 * Create new training module
 */
router.post("/modules", authenticate, requirePermission("training:create"), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      duration,
      isRequired,
      supportsVideo,
      supportsPDF,
      supportsQuiz,
    } = req.body;

    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const moduleId = uuid();

    await query(
      `INSERT INTO trainings (id, title, description, category, duration, isRequired, supportsVideo, supportsPDF, supportsQuiz, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        moduleId,
        title,
        description || null,
        category || null,
        duration || null,
        isRequired ? 1 : 0,
        supportsVideo ? 1 : 0,
        supportsPDF ? 1 : 0,
        supportsQuiz ? 1 : 0,
      ]
    );

    res.json({ success: true, data: { id: moduleId } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/training/modules/:id
 * Update training module
 */
router.put("/modules/:id", authenticate, requirePermission("training:update"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      duration,
      isRequired,
      supportsVideo,
      supportsPDF,
      supportsQuiz,
    } = req.body;

    // Check if module exists
    const existing = await query(`SELECT id FROM trainings WHERE id = ?`, [id]);
    if (!existing || (existing as any[]).length === 0) {
      return res.status(404).json({ success: false, error: "Training module not found" });
    }

    await query(
      `UPDATE trainings 
       SET title = ?, description = ?, category = ?, duration = ?, 
           isRequired = ?, supportsVideo = ?, supportsPDF = ?, supportsQuiz = ?, updatedAt = NOW()
       WHERE id = ?`,
      [
        title,
        description || null,
        category || null,
        duration || null,
        isRequired ? 1 : 0,
        supportsVideo ? 1 : 0,
        supportsPDF ? 1 : 0,
        supportsQuiz ? 1 : 0,
        id,
      ]
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/training/modules/:id
 * Delete training module
 */
router.delete("/modules/:id", authenticate, requirePermission("training:delete"), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if module exists
    const existing = await query(`SELECT id FROM trainings WHERE id = ?`, [id]);
    if (!existing || (existing as any[]).length === 0) {
      return res.status(404).json({ success: false, error: "Training module not found" });
    }

    // Check if module has any assigned records
    const records = await query(`SELECT id FROM employee_training_records WHERE trainingId = ? LIMIT 1`, [id]);
    if (records && (records as any[]).length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Cannot delete training module that has assigned records. Please remove all assignments first." 
      });
    }

    await query(`DELETE FROM trainings WHERE id = ?`, [id]);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/training/records/:id
 * Get a single training record
 */
router.get("/records/:id", authenticate, requirePermission("training:read"), async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;
    const roleNames = currentUser?.roles || [];
    const isAdmin = roleNames.includes("Admin");
    const isHR = roleNames.includes("HR");
    const canViewAll = isAdmin || isHR;

    let sql = `
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
      WHERE etr.id = ?
    `;
    
    const params: any[] = [id];

    const records = await query(sql, params);
    
    if (!records || (records as any[]).length === 0) {
      return res.status(404).json({ success: false, error: "Training record not found" });
    }

    const record = (records as any[])[0];

    // Security: If not Admin/HR, only allow viewing own records
    if (!canViewAll && record.employeeId !== currentUser.id) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    res.json({ success: true, data: record });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/training/records/:id
 * Update training record
 */
router.put("/records/:id", authenticate, requirePermission("training:update"), async (req, res) => {
  try {
    const { id } = req.params;
    const { trainingId, employeeId, dueDate, status, score, certificateUrl, notes } = req.body;
    const currentUser = (req as any).user;
    const roleNames = currentUser?.roles || [];
    const isAdmin = roleNames.includes("Admin");
    const isHR = roleNames.includes("HR");
    const canUpdateAll = isAdmin || isHR;

    // Check if record exists
    const existing = await query(`SELECT * FROM employee_training_records WHERE id = ?`, [id]);
    if (!existing || (existing as any[]).length === 0) {
      return res.status(404).json({ success: false, error: "Training record not found" });
    }

    const record = (existing as any[])[0];

    // Security: If not Admin/HR, only allow updating own records
    if (!canUpdateAll && record.employeeId !== currentUser.id) {
      return res.status(403).json({ success: false, error: "Access denied. You can only update your own training records." });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const params: any[] = [];

    if (trainingId !== undefined) {
      updates.push("trainingId = ?");
      params.push(trainingId);
    }
    if (employeeId !== undefined && canUpdateAll) {
      updates.push("employeeId = ?");
      params.push(employeeId);
    }
    if (dueDate !== undefined) {
      updates.push("dueDate = ?");
      params.push(dueDate || null);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      params.push(status);
      if (status === "completed") {
        updates.push("completedDate = NOW()");
      }
    }
    if (score !== undefined) {
      updates.push("score = ?");
      params.push(score || null);
    }
    if (certificateUrl !== undefined) {
      updates.push("certificateUrl = ?");
      params.push(certificateUrl || null);
    }
    if (notes !== undefined) {
      updates.push("notes = ?");
      params.push(notes || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: "No fields to update" });
    }

    updates.push("updatedAt = NOW()");
    params.push(id);

    await query(
      `UPDATE employee_training_records SET ${updates.join(", ")} WHERE id = ?`,
      params
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/training/records/:id
 * Delete training record
 */
router.delete("/records/:id", authenticate, requirePermission("training:delete"), async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;
    const roleNames = currentUser?.roles || [];
    const isAdmin = roleNames.includes("Admin");
    const isHR = roleNames.includes("HR");
    const canDeleteAll = isAdmin || isHR;

    // Check if record exists
    const existing = await query(`SELECT * FROM employee_training_records WHERE id = ?`, [id]);
    if (!existing || (existing as any[]).length === 0) {
      return res.status(404).json({ success: false, error: "Training record not found" });
    }

    const record = (existing as any[])[0];

    // Security: If not Admin/HR, only allow deleting own records
    if (!canDeleteAll && record.employeeId !== currentUser.id) {
      return res.status(403).json({ success: false, error: "Access denied. You can only delete your own training records." });
    }

    await query(`DELETE FROM employee_training_records WHERE id = ?`, [id]);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/training/assign
 * Assign training to employee(s)
 */
router.post("/assign", authenticate, requirePermission("training:assign"), async (req, res) => {
  try {
    const { employeeIds, trainingId, dueDate } = req.body;

    if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({ success: false, error: "Employee IDs must be an array" });
    }

    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    for (const employeeId of employeeIds) {
      const recordId = uuid();
      await query(
        `INSERT INTO employee_training_records 
         (id, employeeId, trainingId, assignedDate, dueDate, status, createdAt, updatedAt)
         VALUES (?, ?, ?, NOW(), ?, 'pending', NOW(), NOW())
         ON DUPLICATE KEY UPDATE updatedAt = NOW()`,
        [recordId, employeeId, trainingId, dueDate || null]
      );

      // Create notification
      const notificationId = uuid();
      await query(
        `INSERT INTO notifications (id, employeeId, type, title, message, link, createdAt)
         VALUES (?, ?, 'training_assigned', ?, ?, ?, NOW())`,
        [
          notificationId,
          employeeId,
          "New Training Assigned",
          "You have been assigned a new training. Please complete it by the due date.",
          `/training-compliance`,
        ]
      );
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/training/my-trainings
 * Get current user's own trainings (separate endpoint for My Trainings module)
 */
router.get("/my-trainings", authenticate, requirePermission("my_trainings:read"), async (req, res) => {
  try {
    const { status } = req.query;
    const currentUser = (req as any).user;
    const currentUserId = currentUser?.id;

    if (!currentUserId) {
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    let sql = `
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
      WHERE etr.employeeId = ?
    `;
    
    const params: any[] = [currentUserId];

    if (status) {
      sql += " AND etr.status = ?";
      params.push(status);
    }

    sql += " ORDER BY etr.dueDate";

    const trainings = await query(sql, params);
    
    res.json({ success: true, data: trainings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/training/:id/complete
 * Mark training as complete
 */
router.put("/:id/complete", authenticate, requirePermission("training:update"), async (req, res) => {
  try {
    const { id } = req.params;
    const { score, certificateUrl, notes } = req.body;

    await query(
      `UPDATE employee_training_records 
       SET status = 'completed', completedDate = NOW(), score = ?, certificateUrl = ?, notes = ?, updatedAt = NOW()
       WHERE id = ?`,
      [score || null, certificateUrl || null, notes || null, id]
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

