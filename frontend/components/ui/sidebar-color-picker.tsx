"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSidebarTheme, setSidebarTheme, resetSidebarTheme, type SidebarTheme } from "@/lib/sidebar-theme";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";

export function SidebarColorPicker() {
  const [theme, setTheme] = useState<SidebarTheme>({
    backgroundColor: "#ffffff",
    textColor: "#6b7280",
    activeColor: "#22c55e",
    activeTextColor: "#ffffff",
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await getSidebarTheme();
        setTheme(savedTheme);
      } catch (error) {
        console.error("Failed to load theme:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTheme();
    
    const handleThemeUpdate = async () => {
      const updatedTheme = await getSidebarTheme();
      setTheme(updatedTheme);
      setHasChanges(false);
    };
    
    window.addEventListener("sidebarThemeUpdated", handleThemeUpdate);
    return () => {
      window.removeEventListener("sidebarThemeUpdated", handleThemeUpdate);
    };
  }, []);

  const handleColorChange = (key: keyof SidebarTheme, value: string) => {
    const updated = { ...theme, [key]: value };
    setTheme(updated);
    setHasChanges(true);
    // Don't save to database yet - wait for Apply button
  };

  const handleApply = async () => {
    try {
      // Save all current theme values to database
      await setSidebarTheme(theme);
      setHasChanges(false);
      toast.success("Sidebar colors applied successfully");
    } catch (error) {
      toast.error("Failed to save sidebar colors");
    }
  };

  const handleReset = async () => {
    try {
      await resetSidebarTheme();
      const defaultTheme = await getSidebarTheme();
      setTheme(defaultTheme);
      setHasChanges(false);
      toast.success("Sidebar colors reset to default");
    } catch (error) {
      toast.error("Failed to reset sidebar colors");
    }
  };

  // Helper to normalize hex color (ensure it starts with # and is valid)
  const normalizeHex = (color: string): string => {
    // If it's already a hex color, return it
    if (color.startsWith("#")) {
      // Ensure it's 6 digits
      const hex = color.slice(1);
      if (hex.length === 3) {
        // Convert #RGB to #RRGGBB
        return `#${hex.split('').map(c => c + c).join('')}`;
      }
      if (hex.length === 6) {
        return color.toLowerCase();
      }
    }
    // If it's HSL or other format, try to convert or return default
    if (color.startsWith("hsl")) {
      // Convert HSL to hex (fallback)
      return "#22c55e";
    }
    // Default fallback
    return color.startsWith("#") ? color : `#${color}`;
  };

  const handleHexChange = (key: keyof SidebarTheme, hex: string) => {
    const normalizedHex = normalizeHex(hex);
    handleColorChange(key, normalizedHex);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-muted-foreground">Loading theme settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sidebar Colors</h3>
          <p className="text-sm text-muted-foreground">
            Customize the appearance of the sidebar. Changes are previewed in real-time. Click "Apply Changes" to save to database.
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="default" size="sm" onClick={handleApply}>
              Apply Changes
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Background Color */}
        <div className="space-y-2">
          <Label htmlFor="sidebar-bg">Background Color</Label>
          <div className="flex gap-2">
            <Input
              id="sidebar-bg"
              type="color"
              value={normalizeHex(theme.backgroundColor)}
              onChange={(e) => handleHexChange("backgroundColor", e.target.value)}
              className="w-20 h-10 cursor-pointer"
            />
            <Input
              type="text"
              value={normalizeHex(theme.backgroundColor)}
              onChange={(e) => handleColorChange("backgroundColor", normalizeHex(e.target.value))}
              placeholder="#ffffff"
              className="flex-1"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Sidebar background color
          </p>
        </div>

        {/* Text Color */}
        <div className="space-y-2">
          <Label htmlFor="sidebar-text">Text Color</Label>
          <div className="flex gap-2">
            <Input
              id="sidebar-text"
              type="color"
              value={normalizeHex(theme.textColor)}
              onChange={(e) => handleHexChange("textColor", e.target.value)}
              className="w-20 h-10 cursor-pointer"
            />
            <Input
              type="text"
              value={normalizeHex(theme.textColor)}
              onChange={(e) => handleColorChange("textColor", normalizeHex(e.target.value))}
              placeholder="#6b7280"
              className="flex-1"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Default text color for menu items
          </p>
        </div>

        {/* Active Color */}
        <div className="space-y-2">
          <Label htmlFor="sidebar-active">Active Item Color</Label>
          <div className="flex gap-2">
            <Input
              id="sidebar-active"
              type="color"
              value={normalizeHex(theme.activeColor)}
              onChange={(e) => handleHexChange("activeColor", e.target.value)}
              className="w-20 h-10 cursor-pointer"
            />
            <Input
              type="text"
              value={normalizeHex(theme.activeColor)}
              onChange={(e) => handleColorChange("activeColor", normalizeHex(e.target.value))}
              placeholder="#22c55e"
              className="flex-1"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Background color for active menu item
          </p>
        </div>

        {/* Active Text Color */}
        <div className="space-y-2">
          <Label htmlFor="sidebar-active-text">Active Text Color</Label>
          <div className="flex gap-2">
            <Input
              id="sidebar-active-text"
              type="color"
              value={normalizeHex(theme.activeTextColor)}
              onChange={(e) => handleHexChange("activeTextColor", e.target.value)}
              className="w-20 h-10 cursor-pointer"
            />
            <Input
              type="text"
              value={normalizeHex(theme.activeTextColor)}
              onChange={(e) => handleColorChange("activeTextColor", normalizeHex(e.target.value))}
              placeholder="#ffffff"
              className="flex-1"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Text color for active menu item
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="pt-4 border-t">
        <Label>Preview</Label>
        <div 
          className="p-4 rounded-lg border mt-2"
          style={{ backgroundColor: theme.backgroundColor }}
        >
          <div className="space-y-2">
            <div
              className="px-4 py-2 rounded-md"
              style={{
                backgroundColor: theme.activeColor,
                color: theme.activeTextColor,
              }}
            >
              Active Item (Preview)
            </div>
            <div
              className="px-4 py-2 rounded-md"
              style={{ color: theme.textColor }}
            >
              Inactive Item (Preview)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

