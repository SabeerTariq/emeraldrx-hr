"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setLogoUrl, getLogoUrl } from "@/lib/logo-storage";
import { toast } from "sonner";

/**
 * Component to manually set logo URL
 * Useful for debugging and testing
 */
export function ManualLogoSetter() {
  const [logoUrl, setLogoUrlInput] = useState("http://localhost:5000/uploads/file-1763498172551-371424871.png");

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logo = await getLogoUrl();
        const defaultLogo = "http://localhost:5000/uploads/file-1763498172551-371424871.png";
        setLogoUrlInput(logo || defaultLogo);
      } catch (error) {
        console.error("Failed to load logo:", error);
      }
    };
    loadLogo();
  }, []);

  const handleSetLogo = async () => {
    if (!logoUrl.trim()) {
      toast.error("Please enter a logo URL");
      return;
    }

    try {
      await setLogoUrl(logoUrl);
      toast.success("Logo set successfully!");
    } catch (error) {
      toast.error("Failed to set logo URL");
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div>
        <Label htmlFor="manual-logo-url">Manual Logo URL</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Enter a logo URL to set it manually (for testing/debugging)
        </p>
        <div className="flex gap-2">
          <Input
            id="manual-logo-url"
            value={logoUrl}
            onChange={(e) => setLogoUrlInput(e.target.value)}
            placeholder="http://localhost:5000/uploads/filename.png"
            className="flex-1"
          />
          <Button onClick={handleSetLogo} variant="outline">
            Set Logo
          </Button>
        </div>
      </div>
    </div>
  );
}

