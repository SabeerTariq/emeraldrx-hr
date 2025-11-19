import express from "express";
import { query, transaction } from "../config/database.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * GET /api/employees
 * Get all employees
 */
router.get("/", async (req, res) => {
  try {
    const employees = await query(`
      SELECT 
        e.id,
        e.employeeId,
        e.firstName,
        e.lastName,
        e.email,
        e.phone,
        e.hireDate,
        e.isActive,
        d.name as departmentName,
        GROUP_CONCAT(r.name) as roles
      FROM employees e
      LEFT JOIN departments d ON e.departmentId = d.id
      LEFT JOIN employee_roles er ON e.id = er.employeeId
      LEFT JOIN roles r ON er.roleId = r.id
      GROUP BY e.id
      ORDER BY e.employeeId
    `) as any[];
    
    res.json({ success: true, data: employees });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/employees/:id
 * Get single employee
 */
router.get("/:id", async (req, res) => {
  try {
    const employee = await query(`
      SELECT 
        e.*,
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
router.post("/", async (req, res) => {
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
      `INSERT INTO employees (id, employeeId, firstName, lastName, email, phone, dateOfBirth, address, city, state, zipCode, hireDate, departmentId, password, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
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
router.put("/:id", async (req, res) => {
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
      password,
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
router.post("/:id/emergency-contacts", async (req, res) => {
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
 * POST /api/employees/:id/roles
 * Assign roles to employee
 */
router.post("/:id/roles", async (req, res) => {
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

export default router;
