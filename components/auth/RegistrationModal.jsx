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
import Image from "next/image";
import { Label } from "../ui/label";
import { CircleUser, Mail, Lock, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { useActionState } from "react";
import { registerUser, loginWithGoogle, loginWithFacebook } from "@/app/actions/auth/authController";

export default function RegistrationModal() {
  const [showCreatePass, setShowCreatePass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  const [state, formAction, isPending] = useActionState(registerUser, {
    success: false,
    errors: {},
    message: "",
  });

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsFacebookLoading(true);
    try {
      await loginWithFacebook();
    } catch (error) {
      console.error('Facebook sign-in error:', error);
    } finally {
      setIsFacebookLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="text-white font-arone">
          Join Now
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[960px] w-[90%] max-w-[960px] h-[600px] p-0 overflow-hidden">
        <DialogHeader className="hidden">
          <DialogTitle>Registration</DialogTitle>
          <DialogDescription>Please fill in your information</DialogDescription>
        </DialogHeader>

        {/* Container */}
        <div className="flex h-full w-full flex-col sm:flex-row">
          {/* Left section - hidden on mobile */}
          <div className="hidden sm:flex flex-1 bg-[linear-gradient(140deg,#171717_10%,#5B5B5B_50%,#171717_90%)] flex-col items-center justify-center p-8 text-white">
            <div className="flex flex-col justify-center items-center gap-8">
              <p className="font-russo text-3xl">Join Us Today!</p>
              <p className="text-center">
                Sign up and discover all the amazing opportunities waiting for
                you
              </p>
              <Button
                variant={"outline"}
                className={"text-white bg-transparent"}
              >
                Sign in
              </Button>
            </div>
          </div>

          {/* Right section - form */}
          <div className="p-8 flex-1 h-[600px] flex flex-col">
            <div className="flex flex-col items-center gap-2 mb-6">
              <h1 className="font-russo text-3xl">Create Your Account</h1>
              <p className="font-arone">Please fill in your information</p>
            </div>

            <form action={formAction} className="flex-1 flex flex-col justify-between">
              <div className="space-y-3">
              {/* username */}
              <div className="space-y-1">
                <div className="relative">
                  <CircleUser className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                  <Input
                    placeholder="Username"
                    className="pl-10 h-10"
                    name="username"
                  />
                </div>
                <div className="h-[16px]">
                  {state.errors?.username && (
                    <p className="text-red-600 text-xs">
                      {state.errors.username[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                  <Input
                    placeholder="Email"
                    className="pl-10 h-10"
                    name="email"
                  />
                </div>
                <div className="h-[16px]">
                  {state.errors?.email && (
                    <p className="text-red-600 text-xs">
                      {state.errors.email[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Create password */}
              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                  <Input
                    placeholder="Create Password"
                    className="pl-10 h-10"
                    type={showCreatePass ? "text" : "password"}
                    name="CreatePassword"
                  />
                  <Button
                    type="button"
                    variant="icon"
                    onClick={() => setShowCreatePass(!showCreatePass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70"
                  >
                    {showCreatePass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="h-[16px]">
                  {state.errors?.CreatePassword && (
                    <p className="text-red-600 text-xs">
                      {state.errors.CreatePassword[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm password */}
              <div className="space-y-1">
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                  <Input
                    placeholder="Confirm Password"
                    className="pl-10 h-10"
                    type={showConfirmPass ? "text" : "password"}
                    name="ConfirmPassword"
                  />
                  <Button
                    type="button"
                    variant="icon"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70"
                  >
                    {showConfirmPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="h-[16px]">
                  {state.errors?.ConfirmPassword && (
                    <p className="text-red-600 text-xs">
                      {state.errors.ConfirmPassword[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" name="agreeTerms" />
                  <Label htmlFor="remember" className="text-xs font-arone">
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
                <div className="h-[16px]">
                  {state.errors?.agreeTerms && (
                    <p className="text-red-600 text-xs">
                      {state.errors.agreeTerms[0]}
                    </p>
                  )}
                </div>
              </div>
              </div>

              <div>
              {/* Create account button */}
              <Button
                variant="secondary"
                className="w-full h-10 text-white font-medium"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Account"}
              </Button>

              {/* General message */}
              <div className="h-[16px]">
                {state.message && (
                  <p
                    className={`text-center text-xs ${
                      state.success ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {state.message}
                  </p>
                )}
              </div>

              {/* Divider */}
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

              {/* Social buttons */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center font-arone text-xs gap-2 w-[180px] justify-center border-none shadow-[0px_1px_5px_1px_rgba(0,_0,_0,_0.35)] hover:bg-blue-50 hover:border-[#4285F4] hover:text-[#4285F4] h-9"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isPending}
                >
                  {isGoogleLoading ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Image
                      src="/icons/google.png"
                      alt="Google"
                      width={16}
                      height={16}
                    />
                  )}
                  {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 font-arone text-xs w-[180px] justify-center border-none shadow-[0px_1px_5px_1px_rgba(0,_0,_0,_0.35)] hover:bg-blue-50 hover:border-[#1877F2] hover:text-[#1877F2] h-9"
                  onClick={handleFacebookSignIn}
                  disabled={isFacebookLoading || isPending}
                >
                  {isFacebookLoading ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Image
                      src="/icons/facebook.png"
                      alt="Facebook"
                      width={16}
                      height={16}
                    />
                  )}
                  {isFacebookLoading ? "Signing in..." : "Sign in with Facebook"}
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

