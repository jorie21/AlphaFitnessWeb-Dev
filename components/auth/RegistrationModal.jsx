'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogHeader } from '@/components/ui/dialog'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Label } from '../ui/label'
import { CircleUser, Mail, Lock, LockKeyhole, Eye, EyeOff } from 'lucide-react'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'

export default function RegistrationModal() {
  const [showCreatePass, setShowCreatePass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="text-white font-arone">
          Join Now
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[960px] w-[90%] max-w-[960px] h-auto p-0 overflow-hidden">
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
                Sign up and discover all the amazing opportunities waiting for you
              </p>
              <Button variant={"outline"} className={"text-white bg-transparent"}>Sign in</Button>
            </div>
          </div>

          {/* Right section - form */}
          <div className="p-8 flex-1 space-y-8">
            <div className="flex flex-col items-center gap-2">
              <h1 className="font-russo text-3xl">Create Your Account</h1>
              <p className="font-arone">Please fill in your information</p>
            </div>

            <form action="#" className="space-y-4 w-full">
          
              <div className="relative">
                <CircleUser className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                <Input placeholder="Username" className="pl-10 h-12" />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                <Input placeholder="Email" className="pl-10 h-12" />
              </div>

              {/* Create password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                <Input
                  placeholder="Create Password"
                  className="pl-10 h-12"
                  type={showCreatePass ? 'text' : 'password'}
                />
                <Button
                  type="button"
                  variant="icon"
                  onClick={() => setShowCreatePass(!showCreatePass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70"
                >
                  {showCreatePass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>

              {/* Confirm password */}
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-5 h-5" />
                <Input
                  placeholder="Confirm Password"
                  className="pl-10 h-12"
                  type={showConfirmPass ? 'text' : 'password'}
                />
                <Button
                  type="button"
                  variant="icon"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>

              {/* Terms */}
              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="border border-black data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                <Label htmlFor="remember" className="text-sm font-arone">
                  I agree to the{' '}
                  <Button type="button" variant="link" className="inline p-0 h-auto text-blue-600">
                    Terms of Service
                  </Button>{' '}
                  and{' '}
                  <Button type="button" variant="link" className="inline p-0 h-auto text-blue-600">
                    Privacy Policy
                  </Button>
                </Label>
              </div>

              {/* Create account button */}
              <Button type="submit" variant={"secondary"} className="w-full h-11 text-white font-medium">
                Create Account
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-muted-foreground">OR</span>
                </div>
              </div>

              {/* Social buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="flex items-center font-arone text-xs gap-2 w-[200px] justify-center border-none shadow-[0px_1px_5px_1px_rgba(0,_0,_0,_0.35)] hover:bg-blue-50 hover:border-[#4285F4] hover:text-[#4285F4]"
                >
                  <Image src="/icons/google.png" alt="Google" width={20} height={20} />
                  Sign in with Google
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2 font-arone text-xs w-[200px] justify-center border-none shadow-[0px_1px_5px_1px_rgba(0,_0,_0,_0.35)] hover:bg-blue-50 hover:border-[#1877F2] hover:text-[#1877F2]"
                >
                  <Image src="/icons/facebook.png" alt="Facebook" width={20} height={20} />
                  Sign in with Facebook
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
