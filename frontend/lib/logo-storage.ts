/**
 * Logo storage utilities
 * Handles storing and retrieving logo from database
 */

import api from "./api";

// Cache for logo URL (null means not loaded yet, undefined means loading)
let logoCache: string | null | undefined = undefined;
let logoCachePromise: Promise<string | null> | null = null;

export async function getLogoUrl(): Promise<string | null> {
  // Return cached logo if available (null is a valid cached value)
  if (logoCache !== undefined) return logoCache;
  
  // If a request is already in progress, return that promise
  if (logoCachePromise) return logoCachePromise;
  
  // Make API call
  logoCachePromise = (async () => {
    try {
      if (typeof window === "undefined") return null;
      
      const response = await api.get("/settings/sidebar_logo");
      const logo = response.data.data;
      logoCache = logo;
      return logo;
    } catch (error) {
      console.error("Failed to fetch sidebar logo:", error);
      return null;
    } finally {
      logoCachePromise = null;
    }
  })();
  
  return logoCachePromise;
}

export async function setLogoUrl(url: string): Promise<void> {
  try {
    if (typeof window === "undefined") return;
    
    // Save to database
    await api.put("/settings/sidebar_logo", {
      value: url,
      description: "Sidebar logo URL",
    });
    
    // Update cache
    logoCache = url;
    
    // Dispatch event to update sidebar
    window.dispatchEvent(new Event("logoUpdated"));
  } catch (error) {
    console.error("Failed to save sidebar logo:", error);
    throw error;
  }
}

export async function removeLogo(): Promise<void> {
  try {
    if (typeof window === "undefined") return;
    
    // Remove from database
    await api.put("/settings/sidebar_logo", {
      value: null,
      description: "Sidebar logo URL",
    });
    
    // Update cache
    logoCache = null;
    
    // Dispatch event to update sidebar
    window.dispatchEvent(new Event("logoUpdated"));
  } catch (error) {
    console.error("Failed to remove sidebar logo:", error);
    throw error;
  }
}

// Synchronous version for initial render (uses cache)
export function getLogoUrlSync(): string | null {
  return logoCache;
}

