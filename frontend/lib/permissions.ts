import api from "./api";

/**
 * Permission checking utilities
 * Maps routes to required permissions and checks user access
 */

// Map navigation items to their required permission modules
export const routePermissions: Record<string, {
  module: string;
  action: string; // Minimum action required (usually "read")
}> = {
  "/dashboard": { module: "dashboard", action: "read" },
  "/employee-portal": { module: "employees", action: "read" }, // Employee portal accessible to all authenticated users
  "/employee-management": { module: "employees", action: "read" },
  "/department-management": { module: "departments", action: "read" },
  "/user-management": { module: "roles", action: "read" }, // User management requires role access
  "/rbac-management": { module: "roles", action: "read" },
  "/license-tracking": { module: "licenses", action: "read" },
  "/pharmacy-licenses": { module: "pharmacy_licenses", action: "read" },
  "/training-compliance": { module: "training", action: "read" },
  "/my-trainings": { module: "my_trainings", action: "read" }, // Separate module for employee's own trainings
  "/shift-scheduling": { module: "scheduling", action: "read" },
  "/attendance": { module: "attendance", action: "read" },
  "/leave-management": { module: "leave", action: "read" },
  "/hr-documents": { module: "documents", action: "read" },
  "/system-settings": { module: "settings", action: "read" },
};

/**
 * Get user permissions from API
 * Fetches all permissions from user's roles
 */
export async function getUserPermissions(): Promise<Record<string, string[]>> {
  try {
    const response = await api.get("/auth/permissions");
    if (response.data.success) {
      return response.data.data.permissions;
    }
    return {};
  } catch (error) {
    console.error("Failed to fetch user permissions:", error);
    return {};
  }
}

/**
 * Check if user has permission for a specific module and action
 */
export function hasPermission(
  permissions: Record<string, string[]>,
  module: string,
  action: string
): boolean {
  if (!permissions || !permissions[module]) {
    return false;
  }
  return permissions[module].includes(action);
}

/**
 * Check if user can access a route
 */
export function canAccessRoute(
  permissions: Record<string, string[]>,
  route: string
): boolean {
  const routePermission = routePermissions[route];
  if (!routePermission) {
    // If route not in map, allow access (for new routes)
    return true;
  }
  return hasPermission(permissions, routePermission.module, routePermission.action);
}

/**
 * Get all accessible routes for a user
 */
export function getAccessibleRoutes(
  permissions: Record<string, string[]>
): string[] {
  return Object.keys(routePermissions).filter(route =>
    canAccessRoute(permissions, route)
  );
}

