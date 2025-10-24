"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { resetPasswordSchema } from "@/app/actions/validation/registerValidation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  // Check reset session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          toast.error("Error validating reset session.");
          router.push("/");
          return;
        }

        if (!session) {
          toast.error("Invalid or expired reset link. Please request a new one.");
          router.push("/");
          return;
        }

        // Additional check: ensure this is a password recovery session
        if (session.user && session.user.aud === "authenticated") {
          setIsValidSession(true);
        } else {
          toast.error("Invalid reset session type.");
          router.push("/");
        }
      } catch (err) {
        console.error("Session check error:", err);
        toast.error("Error validating reset session.");
        router.push("/");
      } finally {
        setCheckingSession(false);
      }
    };
    
    checkSession();
  }, [router]);

  // Real-time validation with Zod
  useEffect(() => {
    // Only validate if both fields have some content
    if (!password && !confirmPassword) {
      setErrors({});
      return;
    }

    const result = resetPasswordSchema.safeParse({ password, confirmPassword });

    if (!result.success) {
      // flatten organizes errors into a simple object
      const flat = result.error.flatten();

      const fieldErrors = {};
      Object.entries(flat.fieldErrors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          fieldErrors[field] = messages[0]; // first error message only
        }
      });

      setErrors(fieldErrors);
    } else {
      setErrors({});
    }
  }, [password, confirmPassword]);

  const handleReset = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    const result = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const flat = result.error.flatten();
      Object.entries(flat.fieldErrors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          toast.error(messages[0]);
        }
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });
      
      if (error) {
        console.error("Password update error:", error);
        toast.error(error.message || "Failed to reset password.");
        return;
      }

      toast.success("Password updated successfully! Redirecting to login...");

      // Sign out and redirect after a delay
      setTimeout(async () => {
        try {
          await supabase.auth.signOut();
          router.push("/");
        } catch (signOutError) {
          console.error("Sign out error:", signOutError);
          // Still redirect even if sign out fails
          router.push("/");
        }
      }, 2000);
      
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error("Unexpected error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state while checking session
  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-600 font-arone">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Return null if session is invalid (user will be redirected)
  if (!isValidSession) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-russo bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-3xl mb-2">
            Reset Password
          </h1>
          <p className="font-arone opacity-70 text-sm">
            Create a strong new password for your account
          </p>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <form className="space-y-6" onSubmit={handleReset}>
            {/* New Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="font-arone text-sm font-medium"
              >
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={`pl-10 pr-12 h-11 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 h-auto p-0"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="font-arone text-sm font-medium"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={`pl-10 pr-12 h-11 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 h-auto p-0"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="secondary"
              className="w-full h-11 rounded-[10px] text-white font-medium"
              disabled={
                loading ||
                Object.keys(errors).length > 0 ||
                !password ||
                !confirmPassword
              }
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-sm text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}