import express from "express";
import { query, transaction } from "../config/database.js";
import bcrypt from "bcryptjs";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { getAccessibleEmployeeIds, enforceDepartmentAccess } from "../middleware/departmentAccess.js";

const router = express.Router();

/**
 * GET /api/employees
 * Get all employees (filtered by department access)
 * - Department Leads: See their own info + their department members' info
 * - Department Members: See only their own info
 * - Admins/HR/Managers: See all employees
 */
router.get("/", authenticate, requirePermission("employees:read"), async (req, res) => {
  try {
    const user = (req as any).user;
    const accessibleEmployeeIds = await getAccessibleEmployeeIds(user.id);

    // Build base query
    let sql = `
      SELECT 
        e.id,
        e.employeeId,
        e.firstName,
        e.lastName,
        e.email,
        e.phone,
        e.hireDate,
        e.isActive,
        e.designation,
        d.name as departmentName,
        GROUP_CONCAT(r.name) as roles
      FROM employees e
      LEFT JOIN departments d ON e.departmentId = d.id
      LEFT JOIN employee_roles er ON e.id = er.employeeId
      LEFT JOIN roles r ON er.roleId = r.id
    `;

    // Apply department-based filtering if needed
    if (accessibleEmployeeIds !== null) {
      // null means user can view all (Admin/HR/Manager)
      if (accessibleEmployeeIds.length === 0) {
        // No access - return empty array
        return res.json({ success: true, data: [] });
      }
      // Filter by accessible employee IDs
      const placeholders = accessibleEmployeeIds.map(() => '?').join(',');
      sql += ` WHERE e.id IN (${placeholders})`;
    }

    sql += ` GROUP BY e.id ORDER BY e.employeeId`;

    const params = accessibleEmployeeIds !== null ? accessibleEmployeeIds : [];
    const employees = await query(sql, params) as any[];
    
    res.json({ success: true, data: employees });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/employees/:id
 * Get single employee (with department-based access control)
 * - Department Leads: Can view their own info + their department members' info
 * - Department Members: Can only view their own info
 * - Admins/HR/Managers: Can view all employees
 */
router.get("/:id", authenticate, requirePermission("employees:read"), enforceDepartmentAccess, async (req, res) => {
  try {
    const employee = await query(`
      SELECT 
        e.*,
        e.designation,
        d.name as departmentName,
        GROUP_CONCAT(r.name) as roles
      FROM employees e
      LEFT JOIN departments d ON e.departmentId = d.id
      LEFT JOIN employee_roles er ON e.id = er.employeeId
      LEFT JOIN roles r ON er.roleId = r.id
      WHERE e.id = ?
      GROUP BY e.id
    `, [req.params.id]) as any[];
    
    if (Array.isArray(employee) && employee.length === 0) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }
    
    res.json({ success: true, data: employee[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/employees
 * Create new employee
 */
router.post("/", authenticate, requirePermission("employees:create"), async (req, res) => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
      hireDate,
      departmentId,
      designation,
      password,
    } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate UUID
    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const employeeUuid = uuid();

    await query(
      `INSERT INTO employees (id, employeeId, firstName, lastName, email, phone, dateOfBirth, address, city, state, zipCode, hireDate, departmentId, designation, password, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [
        employeeUuid,
        employeeId,
        firstName,
        lastName,
        email,
        phone || null,
        dateOfBirth || null,
        address || null,
        city || null,
        state || null,
        zipCode || null,
        hireDate,
        departmentId || null,
        designation || null,
        hashedPassword,
      ]
    );

    res.json({ success: true, data: { id: employeeUuid } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/employees/:id
 * Update employee
 */
router.put("/:id", authenticate, requirePermission("employees:update"), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
      departmentId,
      designation,
      password,
      terminationDate,
      isActive,
    } = req.body;

    const updateFields: string[] = [];
    const params: any[] = [];

    if (firstName) {
      updateFields.push("firstName = ?");
      params.push(firstName);
    }
    if (lastName) {
      updateFields.push("lastName = ?");
      params.push(lastName);
    }
    if (email) {
      updateFields.push("email = ?");
      params.push(email);
    }
    if (phone !== undefined) {
      updateFields.push("phone = ?");
      params.push(phone);
    }
    if (dateOfBirth !== undefined) {
      updateFields.push("dateOfBirth = ?");
      params.push(dateOfBirth);
    }
    if (address !== undefined) {
      updateFields.push("address = ?");
      params.push(address);
    }
    if (city !== undefined) {
      updateFields.push("city = ?");
      params.push(city);
    }
    if (state !== undefined) {
      updateFields.push("state = ?");
      params.push(state);
    }
    if (zipCode !== undefined) {
      updateFields.push("zipCode = ?");
      params.push(zipCode);
    }
    if (departmentId !== undefined) {
      updateFields.push("departmentId = ?");
      params.push(departmentId);
    }
    if (designation !== undefined) {
      updateFields.push("designation = ?");
      params.push(designation);
    }
    if (terminationDate !== undefined) {
      updateFields.push("terminationDate = ?");
      params.push(terminationDate || null);
    }
    if (isActive !== undefined) {
      updateFields.push("isActive = ?");
      params.push(isActive ? 1 : 0);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push("password = ?");
      params.push(hashedPassword);
    }

    updateFields.push("updatedAt = NOW()");
    params.push(req.params.id);

    await query(
      `UPDATE employees SET ${updateFields.join(", ")} WHERE id = ?`,
      params
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/employees/:id/emergency-contacts
 * Add emergency contacts to employee
 */
router.post("/:id/emergency-contacts", authenticate, requirePermission("employees:update"), async (req, res) => {
  try {
    const { id } = req.params;
    const { contacts } = req.body;

    if (!Array.isArray(contacts)) {
      return res.status(400).json({ success: false, error: "Contacts must be an array" });
    }

    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    for (const contact of contacts) {
      if (contact.name && contact.phone) {
        await query(
          `INSERT INTO emergency_contacts (id, employeeId, name, relationship, phone, email, isPrimary, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            uuid(),
            id,
            contact.name,
            contact.relationship || "Other",
            contact.phone,
            contact.email || null,
            contact.isPrimary ? 1 : 0,
          ]
        );
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/employees/:id/roles
 * Get employee roles
 */
router.get("/:id/roles", async (req, res) => {
  try {
    const { id } = req.params;

    const roles = await query(`
      SELECT r.id, r.name, r.description, r.permissions
      FROM employee_roles er
      JOIN roles r ON er.roleId = r.id
      WHERE er.employeeId = ?
    `, [id]) as any[];

    // Parse permissions JSON
    const parsedRoles = roles.map(role => ({
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
 * POST /api/employees/:id/roles
 * Assign roles to employee
 */
router.post("/:id/roles", authenticate, requirePermission("employees:update"), async (req, res) => {
  try {
    const { id } = req.params;
    const { roleIds } = req.body;

    if (!Array.isArray(roleIds)) {
      return res.status(400).json({ success: false, error: "RoleIds must be an array" });
    }

    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    // Remove existing roles
    await query(`DELETE FROM employee_roles WHERE employeeId = ?`, [id]);

    // Add new roles
    for (const roleId of roleIds) {
      const roleUuid = uuid();
      await query(
        `INSERT INTO employee_roles (id, employeeId, roleId, createdAt)
         VALUES (?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE employeeId = employeeId`,
        [roleUuid, id, roleId]
      );
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/employees/:id/credentials
 * Get employee credentials info (email only, no password)
 */
router.get("/:id/credentials", async (req, res) => {
  try {
    const { id } = req.params;

    const employees = await query(`
      SELECT id, email, employeeId, firstName, lastName
      FROM employees
      WHERE id = ?
    `, [id]) as any[];

    if (employees.length === 0) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    res.json({ success: true, data: employees[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/employees/:id/permissions
 * Get employee's individual permissions
 */
router.get("/:id/permissions", async (req, res) => {
  try {
    const { id } = req.params;
    
    const [permissions] = await query(
      `SELECT permissions FROM employee_permissions WHERE employeeId = ?`,
      [id]
    ) as any[];
    
    if (!permissions || permissions.length === 0) {
      return res.json({
        success: true,
        data: { permissions: null }
      });
    }
    
    const parsedPermissions = typeof permissions.permissions === 'string'
      ? JSON.parse(permissions.permissions)
      : permissions.permissions;
    
    res.json({
      success: true,
      data: { permissions: parsedPermissions }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/employees/:id/permissions
 * Update employee's individual permissions (Admin/HR only)
 */
router.put("/:id/permissions", authenticate, requirePermission("employees:update"), async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;
    
    if (!permissions || typeof permissions !== 'object') {
      return res.status(400).json({
        success: false,
        error: "Permissions must be an object"
      });
    }
    
    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    
    // Check if permissions record exists
    const [existing] = await query(
      `SELECT id FROM employee_permissions WHERE employeeId = ?`,
      [id]
    ) as any[];
    
    if (existing && existing.length > 0) {
      // Update existing
      await query(
        `UPDATE employee_permissions 
         SET permissions = ?, updatedAt = NOW() 
         WHERE employeeId = ?`,
        [JSON.stringify(permissions), id]
      );
    } else {
      // Create new
      await query(
        `INSERT INTO employee_permissions (id, employeeId, permissions, createdAt, updatedAt)
         VALUES (?, ?, ?, NOW(), NOW())`,
        [uuid(), id, JSON.stringify(permissions)]
      );
    }
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/employees/:id/permissions
 * Remove individual permissions (revert to role permissions only)
 */
router.delete("/:id/permissions", authenticate, requirePermission("employees:update"), async (req, res) => {
  try {
    const { id } = req.params;
    
    await query(
      `DELETE FROM employee_permissions WHERE employeeId = ?`,
      [id]
    );
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/employees/:id
 * Delete employee (Admin only)
 * This will cascade delete all related records (roles, attendance, leave requests, etc.)
 */
router.delete("/:id", authenticate, requirePermission("employees:delete"), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const employee = await query(
      `SELECT id, employeeId, firstName, lastName FROM employees WHERE id = ?`,
      [id]
    ) as any[];

    if (employee.length === 0) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Check if trying to delete self (prevent self-deletion)
    const user = (req as any).user;
    if (user.id === id) {
      return res.status(400).json({ 
        success: false, 
        error: "You cannot delete your own account. Please ask another admin to do it." 
      });
    }

    // Delete employee (cascade will handle related records)
    await query(`DELETE FROM employees WHERE id = ?`, [id]);

    res.json({ 
      success: true, 
      message: `Employee ${employee[0].firstName} ${employee[0].lastName} (${employee[0].employeeId}) has been deleted successfully.` 
    });
  } catch (error: any) {
    // Check for foreign key constraint errors
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === '23000') {
      return res.status(400).json({ 
        success: false, 
        error: "Cannot delete employee. There are related records that prevent deletion. Please deactivate the employee instead." 
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/employees/:id/credentials
 * Update employee credentials (email and/or password)
 */
router.put("/:id/credentials", authenticate, requirePermission("employees:update"), async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    // Check if employee exists
    const existing = await query(`
      SELECT id FROM employees WHERE id = ?
    `, [id]) as any[];

    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const updateFields: string[] = [];
    const params: any[] = [];

    if (email !== undefined) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: "Invalid email format" });
      }
      updateFields.push("email = ?");
      params.push(email);
    }

    if (password !== undefined) {
      // Validate password strength
      if (password.length < 8) {
        return res.status(400).json({ success: false, error: "Password must be at least 8 characters long" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push("password = ?");
      params.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, error: "No fields to update" });
    }

    updateFields.push("updatedAt = NOW()");
    params.push(id);

    await query(`
      UPDATE employees SET ${updateFields.join(", ")} WHERE id = ?
    `, params);

    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, error: "Email already exists" });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
