"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, getCurrentUser, clearAuth } from "@/lib/auth";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route Component
 * Wraps routes that require authentication
 * Redirects to login if not authenticated
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      const user = getCurrentUser();

      // No token or user, redirect to login
      if (!token || !user) {
        clearAuth();
        router.push("/login");
        return;
      }

      // Verify token is still valid
      try {
        const response = await api.get("/auth/me");
        if (response.data.success) {
          // Update user info in case it changed
          localStorage.setItem("user", JSON.stringify(response.data.data));
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid token");
        }
      } catch (error: any) {
        // Token invalid or expired
        clearAuth();
        if (pathname !== "/login") {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}

