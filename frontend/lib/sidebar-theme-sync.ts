/**
 * Sidebar theme synchronization utilities
 * Provides functions to apply theme immediately without hydration mismatch
 */

import type { SidebarTheme } from "./sidebar-theme";
import { getSidebarThemeSync, defaultTheme } from "./sidebar-theme";

/**
 * Get theme synchronously (client-side only)
 * Returns theme from blocking script, cache, or default theme
 */
export function getThemeSync(): SidebarTheme {
  // Always return default on server to prevent hydration mismatch
  if (typeof window === "undefined") return defaultTheme;
  
  // First, check if blocking script loaded theme
  if ((window as any).__SIDEBAR_THEME_LOADED__ && (window as any).__SIDEBAR_THEME__) {
    return (window as any).__SIDEBAR_THEME__;
  }
  
  // Fall back to cache or default
  return getSidebarThemeSync();
}

/**
 * Get logo URL synchronously (client-side only)
 * Returns logo from blocking script, cache, or null
 */
export function getLogoUrlSync(): string | null {
  // Always return null on server to prevent hydration mismatch
  if (typeof window === "undefined") return null;
  
  // First, check if blocking script loaded logo
  if ((window as any).__SIDEBAR_LOGO_LOADED__ !== undefined) {
    return (window as any).__SIDEBAR_LOGO__ || null;
  }
  
  // Fall back to cache
  return null;
}

