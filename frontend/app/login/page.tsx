"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { getDashboardRoute, getCurrentUser } from "@/lib/auth";

interface LoginResponse {
  token: string;
  employee: {
    id: string;
    employeeId: string;
    email: string;
    firstName: string;
    lastName: string;
    departmentId: string;
    roles: Array<{ id: string; name: string }>;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = getCurrentUser();
    if (token && user) {
      // Verify token is still valid
      api.get("/auth/me")
        .then((response) => {
          // Token is valid, get user and redirect to appropriate dashboard
          const updatedUser = response.data.data;
          localStorage.setItem("user", JSON.stringify(updatedUser));
          const dashboardRoute = getDashboardRoute(updatedUser);
          router.push(dashboardRoute);
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, [router]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post<{ success: boolean; data: LoginResponse; error?: string }>("/auth/login", credentials);
      if (!response.data.success) {
        throw new Error(response.data.error || "Login failed");
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      // Store token
      localStorage.setItem("token", data.token);
      
      // Store user info
      localStorage.setItem("user", JSON.stringify(data.employee));
      
      // Get dashboard route based on role
      const dashboardRoute = getDashboardRoute(data.employee);
      
      toast.success(`Welcome back, ${data.employee.firstName}!`);
      
      // Redirect to appropriate dashboard
      router.push(dashboardRoute);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-600 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">EmeraldRx HRM</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loginMutation.isPending}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground text-center mb-3">
              Test Users:
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Admin:</span>
                <code className="text-emerald-600">admin@emeraldsrx.com</code>
              </div>
              <div className="flex justify-between">
                <span>HR Manager:</span>
                <code className="text-emerald-600">hrmanager@emeraldsrx.com</code>
              </div>
              <div className="flex justify-between">
                <span>Lead Tech:</span>
                <code className="text-emerald-600">lead.compounding@emeraldsrx.com</code>
              </div>
              <div className="flex justify-between">
                <span>Technician:</span>
                <code className="text-emerald-600">compounding.tech@emeraldsrx.com</code>
              </div>
              <p className="text-center mt-3 text-muted-foreground">
                Password: <code className="text-emerald-600">Password123!</code>
              </p>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}

