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

export default function LoginModal() {
  const [showPass, setShowPass] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outlineSecondary" className="font-arone">
          Sign up
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

              <form className="space-y-5">
                {/* Email address */}
                <div className="space-y-2">
                  <Label htmlFor="email" className={"font-arone"}>
                    Email Address
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                    <Input placeholder="Email" className="pl-10 h-10" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className={"font-arone"}>
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                    <Input
                      placeholder="Password"
                      className="pl-10 h-10"
                      type={showPass ? "text" : "password"}
                    />
                    <Button
                      type="button"
                      variant="icon"
                      onClick={() => setShowPass(!showPass)}
                      className={
                        "absolute right-3 top-1/2 -translate-y-1/2 opacity-70 "
                      }
                    >
                      {showPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" className={"border border-black"} />
                    <Label htmlFor="remember" className="text-sm font-medium">
                      Remember me
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-Blue text-sm"
                    type="button"
                  >
                    Forgot Password
                  </Button>
                </div>

                <Button
                  type="submit"
                  variant={"secondary"}
                  className="w-full h-11 rounded-[10px] text-white font-medium"
                >
                  Sign In
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

                <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
                  <Button
                    variant="outline"
                    className="flex items-center font-arone text-xs gap-2 w-full sm:w-[200px] justify-center border-none shadow-[0px_1px_5px_1px_rgba(0,_0,_0,_0.35)] hover:bg-blue-50 hover:border-[#4285F4] hover:text-[#4285F4]"
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
                    variant="outline"
                    className="flex items-center gap-2 font-arone text-xs w-full sm:w-[200px] justify-center border-none shadow-[0px_1px_5px_1px_rgba(0,_0,_0,_0.35)] hover:bg-blue-50 hover:border-[#1877F2] hover:text-[#1877F2]"
                  >
                    <Image
                      src="/icons/facebook.png"
                      alt="Facebook"
                      width={20}
                      height={20}
                    />
                    Sign in with Facebook
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right content (branding) - hidden on mobile */}
          <div className="hidden sm:flex flex-1 bg-[linear-gradient(140deg,#171717_10%,#5B5B5B_50%,#171717_90%)] flex-col items-center justify-center p-8 text-white relative">
            <div className="flex flex-col justify-center items-center gap-4">
              <Image
                src={"/ALPHAFIT.LOGO.png"}
                alt="AlphaFitness"
                width={200}
                height={200}
              />

              <div className="flex flex-row gap-2 text-2xl">
                <p className="font-russo">WELCOME TO</p>
                <AlphaFitness />
              </div>

              <p className="text-center">
                You weren’t born to be average. You were built to be Alpha.
              </p>

              <Button
                variant={"outline"}
                className={"text-white bg-transparent"}
              >
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
