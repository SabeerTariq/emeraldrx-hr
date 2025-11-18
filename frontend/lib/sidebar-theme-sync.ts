/**
 * Sidebar theme synchronization utilities
 * Provides functions to apply theme immediately without hydration mismatch
 */

import type { SidebarTheme } from "./sidebar-theme";
import { getSidebarThemeSync } from "./sidebar-theme";

/**
 * Get theme synchronously (client-side only)
 * Returns cached theme or default theme
 */
export function getThemeSync(): SidebarTheme {
  return getSidebarThemeSync();
}

/**
 * Apply theme to sidebar element immediately (for blocking script)
 */
export function applyThemeToSidebar(): void {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(SIDEBAR_THEME_KEY);
    if (stored) {
      const theme = JSON.parse(stored);
      const nav = document.querySelector('nav[data-sidebar]') as HTMLElement;
      if (nav) {
        nav.style.backgroundColor = theme.backgroundColor || "#ffffff";
      }
    }
  } catch {
    // Ignore errors
  }
}

