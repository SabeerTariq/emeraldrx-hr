import express from "express";
import { query, transaction } from "../config/database.js";

const router = express.Router();

/**
 * GET /api/incidents
 * Get all incidents
 */
router.get("/", async (req, res) => {
  try {
    const { status, type, severity } = req.query;
    
    let sql = `
      SELECT 
        i.*,
        e.firstName,
        e.lastName,
        e.employeeId,
        reporter.firstName as reporterFirstName,
        reporter.lastName as reporterLastName
      FROM incidents i
      LEFT JOIN employees e ON i.employeeId = e.id
      JOIN employees reporter ON i.reportedBy = reporter.id
    `;
    
    const params: any[] = [];
    const conditions: string[] = [];
    
    if (status) {
      conditions.push("i.status = ?");
      params.push(status);
    }
    
    if (type) {
      conditions.push("i.type = ?");
      params.push(type);
    }
    
    if (severity) {
      conditions.push("i.severity = ?");
      params.push(severity);
    }
    
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    
    sql += " ORDER BY i.reportedAt DESC";
    
    const incidents = await query(sql, params) as any[];
    res.json({ success: true, data: incidents });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/incidents/:id
 * Get single incident with corrective actions
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const incident = await query(`
      SELECT 
        i.*,
        e.firstName,
        e.lastName,
        e.employeeId,
        reporter.firstName as reporterFirstName,
        reporter.lastName as reporterLastName
      FROM incidents i
      LEFT JOIN employees e ON i.employeeId = e.id
      JOIN employees reporter ON i.reportedBy = reporter.id
      WHERE i.id = ?
    `, [id]) as any[];
    
    const correctiveActions = await query(`
      SELECT 
        ca.*,
        e.firstName,
        e.lastName,
        e.employeeId
      FROM corrective_actions ca
      JOIN employees e ON ca.employeeId = e.id
      WHERE ca.incidentId = ?
      ORDER BY ca.dueDate
    `, [id]) as any[];
    
    if (incident.length === 0) {
      return res.status(404).json({ success: false, error: "Incident not found" });
    }
    
    res.json({ 
      success: true, 
      data: { 
        ...incident[0], 
        correctiveActions 
      } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/incidents
 * Create incident report
 */
router.post("/", async (req, res) => {
  try {
    const { type, title, description, employeeId, reportedBy, severity, occurredAt } = req.body;
    
    const result = await query(
      `INSERT INTO incidents (id, type, title, description, employeeId, reportedBy, severity, status, occurredAt, reportedAt, createdAt, updatedAt)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, 'open', ?, NOW(), NOW(), NOW())`,
      [type, title, description, employeeId || null, reportedBy, severity || 'low', occurredAt]
    ) as any;
    
    res.json({ success: true, data: { id: result.insertId } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/incidents/:id/status
 * Update incident status
 */
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;
    
    const updateFields: string[] = ["status = ?", "updatedAt = NOW()"];
    const params: any[] = [status];
    
    if (status === 'closed' && resolutionNotes) {
      updateFields.push("resolvedAt = NOW()", "resolutionNotes = ?");
      params.push(resolutionNotes);
    }
    
    params.push(id);
    
    await query(
      `UPDATE incidents SET ${updateFields.join(", ")} WHERE id = ?`,
      params
    );
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/incidents/:id/corrective-actions
 * Add corrective action to incident
 */
router.post("/:id/corrective-actions", async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, title, description, dueDate } = req.body;
    
    const result = await query(
      `INSERT INTO corrective_actions (id, incidentId, employeeId, title, description, dueDate, status, createdAt, updatedAt)
       VALUES (UUID(), ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
      [id, employeeId, title, description, dueDate]
    ) as any;
    
    res.json({ success: true, data: { id: result.insertId } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

