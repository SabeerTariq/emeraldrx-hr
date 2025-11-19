/**
 * Sidebar theme storage utilities
 * Handles storing and retrieving sidebar color theme from database
 */

import api from "./api";

export interface SidebarTheme {
  backgroundColor: string;
  textColor: string;
  activeColor: string;
  activeTextColor: string;
}

export const defaultTheme: SidebarTheme = {
  backgroundColor: "#ffffff",
  textColor: "#6b7280",
  activeColor: "#22c55e",
  activeTextColor: "#ffffff",
};

// Cache for theme to avoid repeated API calls
let themeCache: SidebarTheme | null = null;
let themeCachePromise: Promise<SidebarTheme> | null = null;

export async function getSidebarTheme(): Promise<SidebarTheme> {
  // Return cached theme if available
  if (themeCache) return themeCache;
  
  // If a request is already in progress, return that promise
  if (themeCachePromise) return themeCachePromise;
  
  // Make API call
  themeCachePromise = (async () => {
    try {
      if (typeof window === "undefined") return defaultTheme;
      
      const response = await api.get("/settings/sidebar_theme");
      const theme = response.data.data || defaultTheme;
      themeCache = { ...defaultTheme, ...theme };
      return themeCache || defaultTheme;
    } catch (error) {
      console.error("Failed to fetch sidebar theme:", error);
      return defaultTheme;
    } finally {
      themeCachePromise = null;
    }
  })();
  
  return themeCachePromise;
}

export async function setSidebarTheme(theme: Partial<SidebarTheme>): Promise<void> {
  try {
    if (typeof window === "undefined") return;
    
    // Get current theme
    const current = await getSidebarTheme();
    const updated = { ...current, ...theme };
    
    // Save to database
    await api.put("/settings/sidebar_theme", {
      value: updated,
      description: "Sidebar color theme settings",
    });
    
    // Update cache
    themeCache = updated;
    
    // Dispatch event to update sidebar
    window.dispatchEvent(new Event("sidebarThemeUpdated"));
  } catch (error) {
    console.error("Failed to save sidebar theme:", error);
    throw error;
  }
}

export async function resetSidebarTheme(): Promise<void> {
  try {
    if (typeof window === "undefined") return;
    
    // Reset to default in database
    await api.put("/settings/sidebar_theme", {
      value: defaultTheme,
      description: "Sidebar color theme settings",
    });
    
    // Update cache
    themeCache = defaultTheme;
    
    // Dispatch event to update sidebar
    window.dispatchEvent(new Event("sidebarThemeUpdated"));
  } catch (error) {
    console.error("Failed to reset sidebar theme:", error);
    throw error;
  }
}

// Synchronous version for initial render (uses cache or default)
export function getSidebarThemeSync(): SidebarTheme {
  return themeCache || defaultTheme;
}

