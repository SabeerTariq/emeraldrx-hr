import express from "express";
import { query } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";

// Helper function to generate UUID (matching database seed pattern)
function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const router = express.Router();

/**
 * GET /api/departments
 * Get all departments
 */
router.get("/", authenticate, async (req, res) => {
  try {
    const departments = await query(`
      SELECT id, name, description, createdAt, updatedAt
      FROM departments
      ORDER BY name
    `) as any[];
    
    res.json({ success: true, data: departments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/departments/:id
 * Get a specific department
 */
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const departments = await query(`
      SELECT id, name, description, createdAt, updatedAt
      FROM departments
      WHERE id = ?
    `, [id]) as any[];
    
    if (departments.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: "Department not found" 
      });
    }
    
    res.json({ success: true, data: departments[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/departments
 * Create a new department
 */
router.post("/", authenticate, requirePermission("departments:create"), async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: "Department name is required" 
      });
    }
    
    // Check if department with same name already exists
    const existing = await query(`
      SELECT id FROM departments WHERE name = ?
    `, [name]) as any[];
    
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Department with this name already exists" 
      });
    }
    
    const id = uuid();
    
    await query(`
      INSERT INTO departments (id, name, description, createdAt, updatedAt)
      VALUES (?, ?, ?, NOW(), NOW())
    `, [id, name, description || null]);
    
    res.status(201).json({ 
      success: true, 
      data: { id, name, description, createdAt: new Date(), updatedAt: new Date() } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/departments/:id
 * Update a department
 */
router.put("/:id", authenticate, requirePermission("departments:update"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: "Department name is required" 
      });
    }
    
    // Check if department exists
    const existing = await query(`
      SELECT id FROM departments WHERE id = ?
    `, [id]) as any[];
    
    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: "Department not found" 
      });
    }
    
    // Check if another department with same name exists
    const duplicate = await query(`
      SELECT id FROM departments WHERE name = ? AND id != ?
    `, [name, id]) as any[];
    
    if (duplicate.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Department with this name already exists" 
      });
    }
    
    await query(`
      UPDATE departments 
      SET name = ?, description = ?, updatedAt = NOW()
      WHERE id = ?
    `, [name, description || null, id]);
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/departments/:id
 * Delete a department
 */
router.delete("/:id", authenticate, requirePermission("departments:delete"), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if department exists
    const existing = await query(`
      SELECT id FROM departments WHERE id = ?
    `, [id]) as any[];
    
    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: "Department not found" 
      });
    }
    
    // Check if any employees are assigned to this department
    const employees = await query(`
      SELECT COUNT(*) as count FROM employees WHERE departmentId = ?
    `, [id]) as any[];
    
    if (employees[0]?.count > 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Cannot delete department. Employees are assigned to this department. Please reassign employees first." 
      });
    }
    
    await query(`
      DELETE FROM departments WHERE id = ?
    `, [id]);
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

