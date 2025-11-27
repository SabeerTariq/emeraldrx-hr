import express from "express";
import { query } from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/auth/login
 * Employee login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: "Email and password are required" 
      });
    }

    // Find employee by email
    const employees = await query(
      `SELECT id, employeeId, email, password, firstName, lastName, isActive, departmentId
       FROM employees 
       WHERE email = ?`,
      [email]
    ) as any[];

    if (employees.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid email or password" 
      });
    }

    const employee = employees[0];

    if (!employee.isActive) {
      return res.status(403).json({ 
        success: false, 
        error: "Account is inactive. Please contact HR." 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, employee.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid email or password" 
      });
    }

    // Get employee roles
    const roles = await query(
      `SELECT r.id, r.name, r.permissions
       FROM employee_roles er
       JOIN roles r ON er.roleId = r.id
       WHERE er.employeeId = ?`,
      [employee.id]
    ) as any[];

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ 
        success: false, 
        error: "Server configuration error" 
      });
    }

    const token = jwt.sign(
      {
        id: employee.id,
        employeeId: employee.employeeId,
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
        departmentId: employee.departmentId,
        roles: roles.map((r: any) => r.name),
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      data: {
        token,
        employee: {
          id: employee.id,
          employeeId: employee.employeeId,
          email: employee.email,
          firstName: employee.firstName,
          lastName: employee.lastName,
          departmentId: employee.departmentId,
          roles: roles.map((r: any) => ({ id: r.id, name: r.name })),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/auth/permissions
 * Get current user's permissions from all roles
 * Requires authentication
 */
router.get("/permissions", authenticate, async (req, res) => {
  try {
    const employeeId = (req as any).employeeId;
    const user = (req as any).user;
    
    if (!employeeId || !user) {
      return res.status(401).json({ 
        success: false, 
        error: "Authentication required" 
      });
    }

    // Get user's roles and permissions
    const roles = await query(
      `SELECT r.permissions
       FROM employee_roles er
       JOIN roles r ON er.roleId = r.id
       WHERE er.employeeId = ?`,
      [user.id]
    ) as any[];

    // Get individual employee permissions (if any)
    const [employeePermsRows] = await query(
      `SELECT permissions FROM employee_permissions WHERE employeeId = ?`,
      [user.id]
    ) as any[];
    
    const individualPermissions = employeePermsRows && employeePermsRows.length > 0
      ? (typeof employeePermsRows[0].permissions === 'string' 
          ? JSON.parse(employeePermsRows[0].permissions) 
          : employeePermsRows[0].permissions)
      : null;

    // Start with individual permissions if they exist (they override role permissions)
    const mergedPermissions: Record<string, string[]> = individualPermissions 
      ? JSON.parse(JSON.stringify(individualPermissions)) // Deep copy
      : {};
    
    // Merge permissions from all roles (only if no individual permissions exist for that module)
    for (const role of roles) {
      const permissions = typeof role.permissions === 'string' 
        ? JSON.parse(role.permissions) 
        : role.permissions;
      
      // Merge permissions - combine all actions for each module
      for (const [module, actions] of Object.entries(permissions)) {
        if (Array.isArray(actions)) {
          // If individual permissions exist for this module, skip role permissions
          if (individualPermissions && individualPermissions[module]) {
            continue;
          }
          
          if (!mergedPermissions[module]) {
            mergedPermissions[module] = [];
          }
          // Add unique actions
          actions.forEach((action: string) => {
            if (!mergedPermissions[module].includes(action)) {
              mergedPermissions[module].push(action);
            }
          });
        }
      }
    }

    res.json({
      success: true,
      data: {
        permissions: mergedPermissions,
      },
    });
  } catch (error: any) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid or expired token" 
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        error: "No token provided" 
      });
    }

    const token = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ 
        success: false, 
        error: "Server configuration error" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

    // Get fresh employee data
    const employees = await query(
      `SELECT id, employeeId, email, firstName, lastName, isActive, departmentId
       FROM employees 
       WHERE id = ?`,
      [decoded.id]
    ) as any[];

    if (employees.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: "Employee not found" 
      });
    }

    const employee = employees[0];

    // Get roles
    const roles = await query(
      `SELECT r.id, r.name
       FROM employee_roles er
       JOIN roles r ON er.roleId = r.id
       WHERE er.employeeId = ?`,
      [employee.id]
    ) as any[];

    res.json({
      success: true,
      data: {
        id: employee.id,
        employeeId: employee.employeeId,
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
        departmentId: employee.departmentId,
        roles: roles.map((r: any) => ({ id: r.id, name: r.name })),
      },
    });
  } catch (error: any) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid or expired token" 
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

