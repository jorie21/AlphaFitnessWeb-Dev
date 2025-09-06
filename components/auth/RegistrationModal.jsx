"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  CircleUser,
  Mail,
  Lock,
  LockKeyhole,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { registerSchema } from "@/app/actions/validation/registerValidation";
import { useAuth } from "@/context/authContext";
import Image from "next/image";

export default function RegistrationModal() {
  const [showCreatePass, setShowCreatePass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const { signUp, loading, signInWithGoogle } = useAuth();
  const [agree, setAgree] = useState(false);

  // ✅ Reset all fields properly
  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setAgree(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // ✅ Call signup then reset
    signUp(formData.username, formData.email, formData.password);
    resetForm();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="text-white font-arone">
          Join Now
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[960px] w-[90%] max-w-[960px] h-[600px] p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="hidden">
          <DialogTitle>Registration</DialogTitle>
          <DialogDescription>Please fill in your information</DialogDescription>
        </DialogHeader>

        {/* Container */}
        <div className="flex h-full w-full flex-col sm:flex-row">
          {/* Left section */}
          <div className="hidden sm:flex flex-1 bg-[linear-gradient(140deg,#171717_10%,#5B5B5B_50%,#171717_90%)] flex-col items-center justify-center p-8 text-white">
            <div className="flex flex-col justify-center items-center gap-6">
              <p className="font-russo text-3xl">Join Us Today!</p>
              <p className="text-center text-sm opacity-90">
                Sign up and discover all the amazing opportunities waiting for
                you
              </p>
              <Button
                variant="outline"
                className="text-white bg-transparent border-white/40 hover:bg-white hover:text-black"
              >
                Sign in
              </Button>
            </div>
          </div>

          {/* Right section - form */}
          <div className="p-8 flex-1 h-[600px] flex flex-col">
            <div className="flex flex-col items-center gap-2 mb-6">
              <h1 className="font-russo text-3xl">Create Your Account</h1>
              <p className="font-arone text-muted-foreground text-sm">
                Please fill in your information
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <div className="relative">
                    <CircleUser className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                    <Input
                      placeholder="Username"
                      className="pl-10 h-10"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">
                    {errors.username || ""}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                    <Input
                      placeholder="Email"
                      className="pl-10 h-10"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">
                    {errors.email || ""}
                  </p>
                </div>

                {/* Password */}
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                    <Input
                      placeholder="Create Password"
                      className="pl-10 h-10"
                      type={showCreatePass ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreatePass(!showCreatePass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 p-1"
                    >
                      {showCreatePass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">
                    {errors.password || ""}
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                    <Input
                      placeholder="Confirm Password"
                      className="pl-10 h-10"
                      type={showConfirmPass ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 p-1"
                    >
                      {showConfirmPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">
                    {errors.confirmPassword || ""}
                  </p>
                </div>

                {/* Terms */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="agree"
                    checked={agree}
                    onCheckedChange={(checked) => setAgree(!!checked)}
                  />
                  <Label htmlFor="agree" className="text-xs font-arone">
                    I agree to the{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="inline p-0 h-auto text-blue-600 text-xs"
                    >
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="inline p-0 h-auto text-blue-600 text-xs"
                    >
                      Privacy Policy
                    </Button>
                  </Label>
                </div>
              </div>

              {/* Footer */}
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full h-10 text-white font-medium"
                  type="submit"
                  disabled={loading || !agree}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-muted-foreground">
                      OR
                    </span>
                  </div>
                </div>

                <div className="flex justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 font-arone text-xs shadow-md hover:bg-blue-50 hover:border-[#4285F4] hover:text-[#4285F4] h-9"
                   onClick={signInWithGoogle}
                  >
                    <Image
                      src="/icons/google.png" 
                      alt="Google"
                      width={20}
                      height={20}
                    />
                    Sign in with Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 font-arone text-xs shadow-md hover:bg-blue-50 hover:border-[#1877F2] hover:text-[#1877F2] h-9"
                  >
                    <Image
                      src="/icons/facebook.png" 
                      alt="Google"
                      width={20}
                      height={20}
                    />
                    Sign in with Facebook
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
