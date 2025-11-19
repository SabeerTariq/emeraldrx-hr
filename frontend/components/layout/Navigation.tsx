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
  UserPlus,
  ClipboardList,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { getLogoUrl } from "@/lib/logo-storage";
import { getSidebarTheme, type SidebarTheme, defaultTheme } from "@/lib/sidebar-theme";
import { getThemeSync, getLogoUrlSync } from "@/lib/sidebar-theme-sync";

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
  { name: "Employee Management", href: "/employee-management", icon: Users },
  { name: "License Tracking", href: "/license-tracking", icon: FileText },
  { name: "Training & Compliance", href: "/training-compliance", icon: GraduationCap },
  { name: "Shift Scheduling", href: "/shift-scheduling", icon: Calendar },
  { name: "Leave Management", href: "/leave-management", icon: CalendarDays },
  { name: "Onboarding Tasks", href: "/onboarding-tasks", icon: UserPlus },
  { name: "Performance Evaluations", href: "/performance-evaluations", icon: ClipboardList },
  { name: "Incident Management", href: "/incident-management", icon: AlertTriangle },
  { name: "System Settings", href: "/system-settings", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  // Initialize with default values to prevent hydration mismatch
  // Will be updated by useEffect on client-side
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<SidebarTheme>(defaultTheme);

  useEffect(() => {
    
    // Load theme from blocking script or API
    const loadTheme = async () => {
      try {
        // First try blocking script (synchronous)
        const blockingTheme = getThemeSync();
        if (blockingTheme && blockingTheme !== defaultTheme) {
          setTheme(blockingTheme);
          const navElement = document.querySelector('nav[data-sidebar]') as HTMLElement;
          if (navElement) {
            navElement.style.backgroundColor = blockingTheme.backgroundColor;
          }
        }
        
        // Then fetch from API to ensure we have latest
        const savedTheme = await getSidebarTheme();
        setTheme(savedTheme);
        const navElement = document.querySelector('nav[data-sidebar]') as HTMLElement;
        if (navElement) {
          navElement.style.backgroundColor = savedTheme.backgroundColor;
        }
      } catch (error) {
        console.error("Failed to load sidebar theme:", error);
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
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-md transition-colors"
                  )}
                  style={{
                    backgroundColor: isActive ? theme.activeColor : "transparent",
                    color: isActive ? theme.activeTextColor : theme.textColor,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = hexToRgba(theme.textColor, 0.1);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
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
    </nav>
  );
}

