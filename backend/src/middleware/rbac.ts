import { Request, Response, NextFunction } from "express";
import { query } from "../config/database.js";

/**
 * Role-Based Access Control Middleware
 * Checks if user has required permissions
 */
export const requirePermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      
      if (!user || !user.id) {
        return res.status(401).json({ 
          success: false, 
          error: "Authentication required" 
        });
      }

      // Use the database UUID (id) from the JWT token, not the employeeId string
      const employeeDbId = user.id;
      
      // Get user's roles
      const roles = await query(
        `SELECT r.permissions 
         FROM employee_roles er
         JOIN roles r ON er.roleId = r.id
         WHERE er.employeeId = ?`,
        [employeeDbId]
      ) as any[];

      if (roles.length === 0) {
        return res.status(403).json({ 
          success: false, 
          error: "No roles assigned. Access denied." 
        });
      }

      // Get individual employee permissions (if any)
      const [employeePermsRows] = await query(
        `SELECT permissions FROM employee_permissions WHERE employeeId = ?`,
        [employeeDbId]
      ) as any[];
      
      const individualPermissions = employeePermsRows && employeePermsRows.length > 0
        ? (typeof employeePermsRows[0].permissions === 'string' 
            ? JSON.parse(employeePermsRows[0].permissions) 
            : employeePermsRows[0].permissions)
        : null;

      // Parse permission format: "module:action" (e.g., "employees:create")
      const [module, action] = requiredPermission.split(":");

      // Check individual permissions first (they override role permissions)
      let hasPermission = false;
      if (individualPermissions && individualPermissions[module] && individualPermissions[module].includes(action)) {
        hasPermission = true;
      } else {
        // Check role permissions if no individual permission found
        for (const role of roles) {
          const permissions = typeof role.permissions === 'string' 
            ? JSON.parse(role.permissions) 
            : role.permissions;
          
          if (permissions[module] && permissions[module].includes(action)) {
            hasPermission = true;
            break;
          }
        }
      }

      if (!hasPermission) {
        return res.status(403).json({ 
          success: false, 
          error: "Insufficient permissions. Access denied." 
        });
      }

      next();
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
};

/**
 * Require specific role
 */
export const requireRole = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      
      if (!user || !user.id) {
        return res.status(401).json({ 
          success: false, 
          error: "Authentication required" 
        });
      }

      // Use the database UUID (id) from the JWT token
      const employeeDbId = user.id;

      // Get user's roles
      const roles = await query(
        `SELECT r.name 
         FROM employee_roles er
         JOIN roles r ON er.roleId = r.id
         WHERE er.employeeId = ?`,
        [employeeDbId]
      ) as any[];

      const userRoles = roles.map((r: any) => r.name);
      const hasRole = allowedRoles.some(role => userRoles.includes(role));

      if (!hasRole) {
        return res.status(403).json({ 
          success: false, 
          error: `Access denied. Required role: ${allowedRoles.join(" or ")}` 
        });
      }

      next();
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
};

/**
 * Check if user is manager (has manager role or is department manager)
 */
export const requireManager = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    
    if (!user || !user.id) {
      return res.status(401).json({ 
        success: false, 
        error: "Authentication required" 
      });
    }

    // Use the database UUID (id) from the JWT token
    const employeeDbId = user.id;

    // Check for manager roles
    const managerRoles = [
      "HR Admin",
      "Compliance Manager",
      "Pharmacy Manager",
      "Department Manager"
    ];

    const roles = await query(
      `SELECT r.name 
       FROM employee_roles er
       JOIN roles r ON er.roleId = r.id
       WHERE er.employeeId = ? AND r.name IN (?)`,
      [employeeDbId, managerRoles]
    ) as any[];

    if (roles.length === 0) {
      return res.status(403).json({ 
        success: false, 
        error: "Manager access required" 
      });
    }

    next();
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

