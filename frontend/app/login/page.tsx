"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LogIn, Loader2, Shield, AlertCircle, XCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import { getDashboardRoute, getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

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
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const hasCheckedAuth = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Check if already logged in (only once on mount)
  useEffect(() => {
    if (hasCheckedAuth.current) return;
    
    const token = localStorage.getItem("token");
    const user = getCurrentUser();
    if (token && user) {
      hasCheckedAuth.current = true;
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
          hasCheckedAuth.current = false;
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
      const errorCodeValue = error.response?.data?.errorCode || null;
      
      setError(errorMessage);
      setErrorCode(errorCodeValue);
      
      // Set field-specific errors
      if (errorCodeValue === "USER_NOT_FOUND") {
        setEmailError(true);
        setPasswordError(false);
      } else if (errorCodeValue === "INVALID_PASSWORD") {
        setEmailError(false);
        setPasswordError(true);
      } else {
        setEmailError(false);
        setPasswordError(false);
      }
      
      toast.error(errorMessage);
    },
  });

  const handleLogin = useCallback(() => {
    // Clear previous errors
    setError("");
    setErrorCode(null);
    setEmailError(false);
    setPasswordError(false);
    
    if (!email || !password) {
      setError("Please enter both email and password");
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      return;
    }

    loginMutation.mutate({ email, password });
  }, [email, password, loginMutation]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleLogin();
  }, [handleLogin]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError(false);
      setError("");
      setErrorCode(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError(false);
      setError("");
      setErrorCode(null);
    }
  };

  const getErrorIcon = () => {
    if (errorCode === "USER_NOT_FOUND") {
      return <XCircle className="h-4 w-4" />;
    } else if (errorCode === "INVALID_PASSWORD") {
      return <Lock className="h-4 w-4" />;
    } else if (errorCode === "ACCOUNT_INACTIVE") {
      return <AlertCircle className="h-4 w-4" />;
    }
    return <AlertCircle className="h-4 w-4" />;
  };

  const getErrorTitle = () => {
    if (errorCode === "USER_NOT_FOUND") {
      return "User Not Found";
    } else if (errorCode === "INVALID_PASSWORD") {
      return "Invalid Password";
    } else if (errorCode === "ACCOUNT_INACTIVE") {
      return "Account Inactive";
    }
    return "Login Error";
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
          <form 
            ref={formRef}
            onSubmit={handleSubmit} 
            className="space-y-4"
            noValidate
          >
            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                {getErrorIcon()}
                <AlertTitle>{getErrorTitle()}</AlertTitle>
                <AlertDescription>
                  {error}
                  {errorCode === "USER_NOT_FOUND" && (
                    <p className="mt-2 text-xs">
                      Please check your email address and try again.
                    </p>
                  )}
                  {errorCode === "INVALID_PASSWORD" && (
                    <p className="mt-2 text-xs">
                      The password you entered is incorrect. Please try again or contact HR if you've forgotten your password.
                    </p>
                  )}
                  {errorCode === "ACCOUNT_INACTIVE" && (
                    <p className="mt-2 text-xs">
                      Your account has been deactivated. Please contact your HR department for assistance.
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                disabled={loginMutation.isPending}
                required
                autoFocus
                className={cn(
                  emailError && "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={emailError}
                aria-describedby={emailError ? "email-error" : undefined}
              />
              {emailError && (
                <p id="email-error" className="text-sm text-destructive mt-1">
                  This email address is not registered in our system.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                disabled={loginMutation.isPending}
                required
                className={cn(
                  passwordError && "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={passwordError}
                aria-describedby={passwordError ? "password-error" : undefined}
              />
              {passwordError && (
                <p id="password-error" className="text-sm text-destructive mt-1">
                  The password you entered is incorrect.
                </p>
              )}
            </div>

            <Button
              type="button"
              className="w-full"
              disabled={loginMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLogin();
              }}
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

