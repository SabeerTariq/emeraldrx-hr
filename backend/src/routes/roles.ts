import express from "express";
import { query } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";

const router = express.Router();

/**
 * GET /api/roles
 * Get all roles
 */
router.get("/", authenticate, requirePermission("roles:read"), async (req, res) => {
  try {
    const roles = await query(`
      SELECT id, name, description, permissions, createdAt, updatedAt
      FROM roles
      ORDER BY name
    `);
    
    // Parse permissions JSON for each role
    const parsedRoles = (roles as any[]).map(role => ({
      ...role,
      permissions: typeof role.permissions === 'string' 
        ? JSON.parse(role.permissions) 
        : role.permissions
    }));
    
    res.json({ success: true, data: parsedRoles });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/roles/:id
 * Get single role by ID
 */
router.get("/:id", authenticate, requirePermission("roles:read"), async (req, res) => {
  try {
    const { id } = req.params;
    
    const roles = await query(`
      SELECT id, name, description, permissions, createdAt, updatedAt
      FROM roles
      WHERE id = ?
    `, [id]) as any[];
    
    if (roles.length === 0) {
      return res.status(404).json({ success: false, error: "Role not found" });
    }
    
    const role = roles[0];
    role.permissions = typeof role.permissions === 'string' 
      ? JSON.parse(role.permissions) 
      : role.permissions;
    
    res.json({ success: true, data: role });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/roles
 * Create new role
 */
router.post("/", authenticate, requirePermission("roles:create"), async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: "Role name is required" });
    }

    // Validate permissions structure
    if (permissions && typeof permissions !== 'object') {
      return res.status(400).json({ success: false, error: "Permissions must be an object" });
    }

    // Generate UUID
    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const roleId = uuid();
    const permissionsJson = permissions ? JSON.stringify(permissions) : JSON.stringify({});

    await query(`
      INSERT INTO roles (id, name, description, permissions, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `, [roleId, name, description || null, permissionsJson]);

    res.json({ success: true, data: { id: roleId } });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, error: "Role name already exists" });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/roles/:id
 * Update role
 */
router.put("/:id", authenticate, requirePermission("roles:update"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    // Check if role exists
    const existing = await query(`
      SELECT id FROM roles WHERE id = ?
    `, [id]) as any[];

    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: "Role not found" });
    }

    const updateFields: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      updateFields.push("name = ?");
      params.push(name);
    }
    if (description !== undefined) {
      updateFields.push("description = ?");
      params.push(description);
    }
    if (permissions !== undefined) {
      if (typeof permissions !== 'object') {
        return res.status(400).json({ success: false, error: "Permissions must be an object" });
      }
      updateFields.push("permissions = ?");
      params.push(JSON.stringify(permissions));
    }

    updateFields.push("updatedAt = NOW()");
    params.push(id);

    await query(`
      UPDATE roles SET ${updateFields.join(", ")} WHERE id = ?
    `, params);

    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, error: "Role name already exists" });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/roles/:id
 * Delete role
 */
router.delete("/:id", authenticate, requirePermission("roles:delete"), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if role exists
    const existing = await query(`
      SELECT id FROM roles WHERE id = ?
    `, [id]) as any[];

    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: "Role not found" });
    }

    // Check if role is assigned to any employees
    const assigned = await query(`
      SELECT COUNT(*) as count FROM employee_roles WHERE roleId = ?
    `, [id]) as any[];

    if (assigned[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `Cannot delete role. It is assigned to ${assigned[0].count} employee(s). Please remove role assignments first.` 
      });
    }

    await query(`DELETE FROM roles WHERE id = ?`, [id]);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

