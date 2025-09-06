"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import AlphaFitness from "../Alphafitness";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { loginSchema } from "@/app/actions/validation/registerValidation";
import { useAuth } from "@/context/authContext";
import { email } from "zod";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginModal() {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [email, setEmail] = useState();
  const [errors, setErrors] = useState({});
  const { signIn, loading } = useAuth();
  const router = useRouter();
  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null }); // clear error as user types
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        // Each issue.path is like ["email"] or ["password"]
        const field = issue.path[0];
        // Only keep the first error message for each field
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    // ✅ Clear errors when valid
    setErrors({});

    signIn(formData.email, formData.password).then(() => {
      // refresh client-side cache & UI
      router.refresh();
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outlineSecondary" className="font-arone">
          Sign In
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[960px] w-[90%] max-w-[960px] h-auto p-0 overflow-hidden">
        <DialogHeader className="hidden">
          <DialogTitle>Login Modal</DialogTitle>
          <DialogDescription>
            Sign in to your Alpha Fitness account
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row h-full w-full">
          {/* Left content (form) */}
          <div className="flex-1 p-8">
            <div className="flex items-center gap-2 mb-8">
              <Image
                src="/ALPHAFIT.LOGO.png"
                height={50}
                width={50}
                alt="AlphaFitness"
              />
              <AlphaFitness />
            </div>

            <div className="flex flex-col gap-6 justify-center">
              <div className="text-center mb-4">
                <h1 className="font-russo bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-3xl mb-2">
                  Welcome Back
                </h1>
                <p className="font-arone opacity-70 text-sm">
                  Please enter your details to sign in
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-arone">
                    Email Address
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 h-10 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-arone">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                    <Input
                      id="password"
                      name="password"
                      type={showPass ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 h-10 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 h-auto p-0"
                    >
                      {showPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" className="border border-black" />
                    <Label htmlFor="remember" className="text-sm font-medium">
                      Remember me
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 text-sm"
                    type="button"
                  >
                    Forgot Password
                  </Button>
                </div>

                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full h-11 rounded-[10px] text-white font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right content (branding) */}
          <div className="hidden sm:flex flex-1 bg-[linear-gradient(140deg,#171717_10%,#5B5B5B_50%,#171717_90%)] flex-col items-center justify-center p-8 text-white relative">
            <div className="flex flex-col justify-center items-center gap-4">
              <Image
                src="/ALPHAFIT.LOGO.png"
                alt="AlphaFitness"
                width={200}
                height={200}
              />
              <div className="flex flex-row gap-2 text-2xl">
                <p className="font-russo">WELCOME TO</p>
                <AlphaFitness />
              </div>
              <p className="text-center">
                You weren't born to be average. You were built to be Alpha.
              </p>
              <Button variant="outline" className="text-white bg-transparent">
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
