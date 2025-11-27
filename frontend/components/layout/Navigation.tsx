"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  GraduationCap,
  Calendar,
  CalendarDays,
  Settings,
  Shield,
  Key,
  LogOut,
  Building2,
} from "lucide-react";
import { getLogoUrl } from "@/lib/logo-storage";
import { getSidebarTheme, type SidebarTheme, defaultTheme } from "@/lib/sidebar-theme";
import { getThemeSync, getLogoUrlSync } from "@/lib/sidebar-theme-sync";
import { getCurrentUser, clearAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUserPermissions, hasPermission, routePermissions } from "@/lib/permissions";

// Helper to convert hex to rgba
function hexToRgba(hex: string, alpha: number = 1): string {
  // Remove # if present
  const cleanHex = hex.replace("#", "");
  
  // Handle 3-digit hex
  const fullHex = cleanHex.length === 3
    ? cleanHex.split("").map(c => c + c).join("")
    : cleanHex;
  
  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employee Portal", href: "/employee-portal", icon: Users },
  { name: "My Trainings", href: "/my-trainings", icon: GraduationCap },
  { name: "Employee Management", href: "/employee-management", icon: Users },
  { name: "Department Management", href: "/department-management", icon: Building2 },
  { name: "User Management", href: "/user-management", icon: Key },
  { name: "RBAC Management", href: "/rbac-management", icon: Shield },
  { name: "Employee Licenses", href: "/license-tracking", icon: FileText },
  { name: "Pharmacy Licenses", href: "/pharmacy-licenses", icon: FileText },
  { name: "Training & Compliance", href: "/training-compliance", icon: GraduationCap },
  { name: "Shift Scheduling", href: "/shift-scheduling", icon: Calendar },
  { name: "Attendance", href: "/attendance", icon: Calendar },
  { name: "Leave Management", href: "/leave-management", icon: CalendarDays },
  { name: "HR Documents", href: "/hr-documents", icon: FileText },
  { name: "System Settings", href: "/system-settings", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  // Initialize with default values to prevent hydration mismatch
  // Will be updated by useEffect on client-side
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<SidebarTheme>(defaultTheme);
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Load user info and permissions
  useEffect(() => {
    const loadUserAndPermissions = async () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userPermissions = await getUserPermissions();
          setPermissions(userPermissions);
          setPermissionsLoaded(true);
        } catch (error) {
          console.error("Failed to load permissions:", error);
          setPermissionsLoaded(true);
        }
      } else {
        setPermissionsLoaded(true);
      }
    };
    
    loadUserAndPermissions();
  }, []);

  useEffect(() => {
    // Apply theme colors to DOM elements (helper function)
    const applyThemeToDOM = (themeToApply: SidebarTheme) => {
      const navElement = document.querySelector('nav[data-sidebar]') as HTMLElement;
      if (navElement) {
        navElement.style.backgroundColor = themeToApply.backgroundColor;
      }
      
      // Update all navigation links with theme colors
      const navLinks = document.querySelectorAll('nav[data-sidebar] a');
      navLinks.forEach((link) => {
        const linkElement = link as HTMLElement;
        const isActive = linkElement.getAttribute('data-active') === 'true';
        if (isActive) {
          linkElement.style.backgroundColor = themeToApply.activeColor;
          linkElement.style.color = themeToApply.activeTextColor;
        } else {
          linkElement.style.color = themeToApply.textColor;
        }
      });
    };
    
    // Load theme from blocking script or API
    const loadTheme = async () => {
      try {
        // Always fetch from database - don't use hardcoded defaults
        const savedTheme = await getSidebarTheme();
        
        // Only use theme if it's actually from database
        // If API returns defaultTheme, it means database has no value yet
        // In that case, we should still use it (it will be saved when user customizes)
        setTheme(savedTheme);
        applyThemeToDOM(savedTheme);
      } catch (error) {
        console.error("Failed to load sidebar theme:", error);
        // If API fails, try blocking script as fallback
        const blockingTheme = getThemeSync();
        if (blockingTheme) {
          setTheme(blockingTheme);
          applyThemeToDOM(blockingTheme);
        } else {
          // Last resort: use defaultTheme only if absolutely necessary
          // This should rarely happen - only if both API and blocking script fail
          setTheme(defaultTheme);
          applyThemeToDOM(defaultTheme);
        }
      }
    };
    
    // Load logo from blocking script or API
    const loadLogo = async () => {
      try {
        // First try blocking script (synchronous)
        const blockingLogo = getLogoUrlSync();
        if (blockingLogo !== null) {
          setLogoUrl(blockingLogo);
        }
        
        // Then fetch from API to ensure we have latest
        const logo = await getLogoUrl();
        setLogoUrl(logo);
      } catch (error) {
        console.error("Failed to load sidebar logo:", error);
      }
    };
    
    loadTheme();
    loadLogo();

    // Listen for custom events (for same-tab updates)
    const handleLogoUpdate = async () => {
      const logo = await getLogoUrl();
      setLogoUrl(logo);
    };

    const handleThemeUpdate = async () => {
      const updatedTheme = await getSidebarTheme();
      setTheme(updatedTheme);
      applyThemeToDOM(updatedTheme);
    };

    window.addEventListener("logoUpdated", handleLogoUpdate);
    window.addEventListener("sidebarThemeUpdated", handleThemeUpdate);

    return () => {
      window.removeEventListener("logoUpdated", handleLogoUpdate);
      window.removeEventListener("sidebarThemeUpdated", handleThemeUpdate);
    };
  }, []);

  // Apply theme styles - loaded from database
  const navStyle: React.CSSProperties = {
    backgroundColor: theme.backgroundColor,
  };

  return (
    <nav 
      data-sidebar
      className="border-r w-64 h-screen flex flex-col fixed left-0 top-0 overflow-hidden"
      style={navStyle}
    >
      {/* Header - Fixed */}
      <div 
        className="p-4 border-b flex-shrink-0" 
        style={{ 
          borderColor: hexToRgba(theme.textColor, 0.2)
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {logoUrl ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <img
                src={logoUrl}
                alt="Logo"
                className="h-12 w-auto max-w-[180px] object-contain"
                crossOrigin="anonymous"
                onError={() => {
                  // If logo fails to load, remove it
                  console.error("Logo failed to load:", logoUrl);
                  setLogoUrl(null);
                }}
              />
            </div>
          ) : (
            <h2 
              className="text-xl font-bold truncate"
              style={{ 
                color: theme.textColor
              }}
            >
              EmeraldRx HRM
            </h2>
          )}
        </div>
      </div>
      
      {/* Navigation Items - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scrollbar">
        <ul className="space-y-2 p-4">
          {navigation
            .filter((item) => {
              // If permissions not loaded yet, show all items (will filter after load)
              if (!permissionsLoaded) return true;
              
              // Employee Portal is always accessible to authenticated users (personal portal)
              if (item.href === "/employee-portal") {
                return true;
              }
              
              // Explicitly check for "read" permission for the module associated with this route
              const routePermission = routePermissions[item.href];
              if (!routePermission) {
                // If route not in map, allow access (for new routes)
                return true;
              }
              
              // Verify user has "read" permission for this module
              const hasReadPermission = hasPermission(permissions, routePermission.module, "read");
              return hasReadPermission;
            })
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    data-active={isActive}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-md transition-colors"
                    )}
                    style={{
                      backgroundColor: isActive ? theme.activeColor : "transparent",
                      color: isActive ? theme.activeTextColor : theme.textColor,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        // Use database theme color for hover, not hardcoded
                        e.currentTarget.style.backgroundColor = hexToRgba(theme.textColor, 0.1);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      } else {
                        // Ensure active color is maintained from database
                        e.currentTarget.style.backgroundColor = theme.activeColor;
                        e.currentTarget.style.color = theme.activeTextColor;
                      }
                    }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>

      {/* User Info & Logout - Fixed at bottom */}
      <div 
        className="border-t p-4 flex-shrink-0"
        style={{ 
          borderColor: hexToRgba(theme.textColor, 0.2)
        }}
      >
        {user && (
          <div className="mb-3">
            <p 
              className="text-sm font-medium truncate"
              style={{ color: theme.textColor }}
            >
              {user.firstName} {user.lastName}
            </p>
            <p 
              className="text-xs truncate"
              style={{ color: hexToRgba(theme.textColor, 0.7) }}
            >
              {user.roles.map(r => r.name).join(", ")}
            </p>
          </div>
        )}
        <button
          onClick={() => {
            clearAuth();
            toast.success("Logged out successfully");
            router.replace("/login");
          }}
          className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-md transition-colors w-full"
          )}
          style={{
            color: theme.textColor,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = hexToRgba(theme.textColor, 0.1);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </nav>
  );
}

