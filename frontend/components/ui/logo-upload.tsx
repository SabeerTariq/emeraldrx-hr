"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { getLogoUrl, setLogoUrl, removeLogo } from "@/lib/logo-storage";

interface LogoUploadProps {
  onLogoChange?: (url: string | null) => void;
}

export function LogoUpload({ onLogoChange }: LogoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logo = await getLogoUrl();
        setCurrentLogo(logo);
        if (onLogoChange) {
          onLogoChange(logo);
        }
      } catch (error) {
        console.error("Failed to load logo:", error);
      }
    };
    loadLogo();
  }, [onLogoChange]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    },
    onSuccess: async (data) => {
      // Construct full URL to backend
      // Use environment variable or default to localhost:5000
      const backendUrl = typeof window !== "undefined" 
        ? (window.location.origin.includes("localhost:3000") 
            ? "http://localhost:5000" 
            : process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000")
        : "http://localhost:5000";
      
      const logoUrl = data.url.startsWith("http") 
        ? data.url 
        : `${backendUrl}${data.url}`;
      
      try {
        // Save to database
        await setLogoUrl(logoUrl);
        setCurrentLogo(logoUrl);
        toast.success("Logo uploaded successfully");
        
        if (onLogoChange) {
          onLogoChange(logoUrl);
        }
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Failed to save logo to database:", error);
        toast.error("Logo uploaded but failed to save to database");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to upload logo");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only allow images
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size (max 2MB for logo)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo size must be less than 2MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleRemove = async () => {
    try {
      await removeLogo();
      setCurrentLogo(null);
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Logo removed");
      
      if (onLogoChange) {
        onLogoChange(null);
      }
    } catch (error) {
      toast.error("Failed to remove logo");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Sidebar Logo</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a logo image to display in the sidebar. Recommended size: 200x60px. Max size: 2MB.
        </p>
        
        {/* Current Logo Preview */}
        {currentLogo && !preview && (
          <div className="mb-4 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Logo</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <img 
                src={currentLogo} 
                alt="Current logo" 
                className="max-h-16 max-w-48 object-contain rounded"
                onError={() => {
                  // If image fails to load, remove it
                  handleRemove();
                }}
              />
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="space-y-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="logo-upload"
          />
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {currentLogo ? "Change Logo" : "Upload Logo"}
            </Button>
            {selectedFile && (
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="text-sm">{selectedFile.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Preview */}
          {preview && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <Label className="mb-2 block">Preview</Label>
              <img 
                src={preview} 
                alt="Logo preview" 
                className="max-h-16 max-w-48 object-contain rounded"
              />
            </div>
          )}
        </div>
      </div>
      
      {selectedFile && (
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Uploading..." : "Save Logo"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedFile(null);
              setPreview(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

