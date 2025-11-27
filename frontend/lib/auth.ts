/**
 * Authentication utilities
 * Handles token storage, user info, and role checking
 */

export interface User {
  id: string;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  roles: Array<{ id: string; name: string }>;
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

/**
 * Get auth token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, roleName: string): boolean {
  if (!user) return false;
  return user.roles.some(role => role.name === roleName);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roleNames: string[]): boolean {
  if (!user) return false;
  return user.roles.some(role => roleNames.includes(role.name));
}

/**
 * Get user's primary role (first role, or Admin if present)
 */
export function getPrimaryRole(user: User | null): string | null {
  if (!user || user.roles.length === 0) return null;
  
  // Admin takes priority
  const adminRole = user.roles.find(r => r.name === "Admin");
  if (adminRole) return adminRole.name;
  
  // Return first role
  return user.roles[0].name;
}

/**
 * Get dashboard route based on user's roles
 */
export function getDashboardRoute(user: User | null): string {
  if (!user) return "/login";
  
  const roles = user.roles.map(r => r.name);
  
  // Admin and HR go to main dashboard
  if (roles.includes("Admin") || roles.includes("HR")) {
    return "/dashboard";
  }
  
  // Employees go to employee portal
  if (roles.includes("Employee")) {
    return "/employee-portal";
  }
  
  // Default to main dashboard
  return "/dashboard";
}

/**
 * Clear authentication data
 */
export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null && getCurrentUser() !== null;
}

