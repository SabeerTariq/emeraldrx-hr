import { Request, Response, NextFunction } from "express";
import { query } from "../config/database.js";

/**
 * Department-Based Access Control Middleware
 * 
 * This middleware enforces department-based access:
 * - Department Leads: Can view their own info + their department members' info (read-only)
 * - Department Members: Can only view their own info
 * - Admins/HR/Managers: Can view all (no restrictions)
 */

/**
 * Get user's department and role information
 */
export const getUserDepartmentInfo = async (userId: string) => {
  try {
    // Get employee info with department
    const employeeResult = await query(
      `SELECT e.id, e.departmentId, d.name as departmentName
       FROM employees e
       LEFT JOIN departments d ON e.departmentId = d.id
       WHERE e.id = ?`,
      [userId]
    ) as any[];

    if (!employeeResult || employeeResult.length === 0) {
      return null;
    }

    const employee = employeeResult[0];

    // Get user's roles
    const roles = await query(
      `SELECT r.name 
       FROM employee_roles er
       JOIN roles r ON er.roleId = r.id
       WHERE er.employeeId = ?`,
      [userId]
    ) as any[];

    const roleNames = roles.map((r: any) => r.name);

    return {
      employeeId: employee.id,
      departmentId: employee.departmentId,
      departmentName: employee.departmentName,
      roles: roleNames,
      isAdmin: roleNames.includes("Admin"),
      isHR: roleNames.includes("HR"),
      isManager: roleNames.some((role: string) => 
        ["HR Admin", "Compliance Manager", "Pharmacy Manager", "Department Manager", "Lead Technician"].includes(role)
      ),
      isDepartmentLead: roleNames.includes("Department Lead"),
      isDepartmentMember: roleNames.includes("Department Member") || roleNames.includes("Employee"), // Employee role is treated as department member
    };
  } catch (error) {
    console.error("Error getting user department info:", error);
    return null;
  }
};

/**
 * Check if user has access to view a specific employee
 * Returns true if access is allowed, false otherwise
 */
export const canViewEmployee = async (viewerId: string, targetEmployeeId: string): Promise<boolean> => {
  try {
    // Same user can always view themselves
    if (viewerId === targetEmployeeId) {
      return true;
    }

    const viewerInfo = await getUserDepartmentInfo(viewerId);
    if (!viewerInfo) {
      return false;
    }

    // Admins, HR, and Managers can view all
    if (viewerInfo.isAdmin || viewerInfo.isHR || viewerInfo.isManager) {
      return true;
    }

    // Department Leads can view their department members
    if (viewerInfo.isDepartmentLead && viewerInfo.departmentId) {
      const targetEmployeeResult = await query(
        `SELECT departmentId FROM employees WHERE id = ?`,
        [targetEmployeeId]
      ) as any[];

      if (targetEmployeeResult && targetEmployeeResult.length > 0) {
        const targetEmployee = targetEmployeeResult[0];
        // Can view if target is in the same department
        return targetEmployee.departmentId === viewerInfo.departmentId;
      }
    }

    // Department Members can only view themselves (already checked above)
    return false;
  } catch (error) {
    console.error("Error checking employee access:", error);
    return false;
  }
};

/**
 * Get list of employee IDs that the user can view
 * Returns array of employee IDs or null if user can view all
 */
export const getAccessibleEmployeeIds = async (userId: string): Promise<string[] | null> => {
  try {
    const userInfo = await getUserDepartmentInfo(userId);
    if (!userInfo) {
      return [];
    }

    // Admins, HR, and Managers can view all (return null to indicate no filtering needed)
    if (userInfo.isAdmin || userInfo.isHR || userInfo.isManager) {
      return null;
    }

    // Department Leads can view themselves + their department members
    if (userInfo.isDepartmentLead && userInfo.departmentId) {
      const departmentEmployees = await query(
        `SELECT id FROM employees WHERE departmentId = ? AND isActive = 1`,
        [userInfo.departmentId]
      ) as any[];

      return departmentEmployees.map((emp: any) => emp.id);
    }

    // Department Members (including Employee role) can only view themselves
    if (userInfo.isDepartmentMember) {
      return [userInfo.employeeId];
    }

    // Default: no access
    return [];
  } catch (error) {
    console.error("Error getting accessible employee IDs:", error);
    return [];
  }
};

/**
 * Middleware to attach department access info to request
 */
export const attachDepartmentAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    
    if (!user || !user.id) {
      return next();
    }

    const departmentInfo = await getUserDepartmentInfo(user.id);
    if (departmentInfo) {
      (req as any).departmentAccess = departmentInfo;
    }

    next();
  } catch (error) {
    console.error("Error attaching department access:", error);
    next();
  }
};

/**
 * Middleware to enforce department-based access control for employee viewing
 */
export const enforceDepartmentAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    
    if (!user || !user.id) {
      return res.status(401).json({ 
        success: false, 
        error: "Authentication required" 
      });
    }

    // For GET /api/employees/:id, check if user can view the specific employee
    if (req.params.id) {
      const canView = await canViewEmployee(user.id, req.params.id);
      if (!canView) {
        return res.status(403).json({ 
          success: false, 
          error: "Access denied. You can only view your own information or your department members' information." 
        });
      }
    }

    next();
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

