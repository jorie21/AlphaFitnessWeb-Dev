"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import AlphaFitness from "@/components/Alphafitness";
import { menus } from "@/constant/menu";
import LoginModal from "./auth/LoginModal";
import RegistrationModal from "./auth/RegistrationModal";
import { useAuth } from "@/context/authContext";
import ProfileDropdown from "./ProfileDropdown";
import { useState } from "react";


export default function Topbar() {
  const { signOut, session, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSmoothScroll = (e, path) => {
    if (path.startsWith("#")) {
      e.preventDefault();

      const targetId = path.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      history.replaceState(null, "", " ");
      
      // Close mobile menu after navigation
      setOpen(false);
    }
  };

  const logout = (e) => {
    e.preventDefault();
    signOut();
    setOpen(false);
  };

  return (
    <header className="bg-white fixed top-0 left-0 w-full z-50 shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-between p-4 text-black screen">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <Image
            src="/ALPHAFIT.LOGO.png"
            alt="Alpha Fitness Logo"
            width={50}
            height={50}
          />
          <AlphaFitness />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-10">
          {menus.map((menu, index) => (
            <Link
              key={index}
              href={menu.path}
              scroll={false}
              onClick={(e) => handleSmoothScroll(e, menu.path)}
              className="hover:text-secondary transition-colors font-arone"
            >
              {menu.title}
            </Link>
          ))}
        </nav>

        {/* Buttons (Desktop) */}
        {loading ? (
          <div className="hidden md:flex items-center gap-2">
            <div className="h-8 w-24 rounded-md bg-gray-200 animate-pulse"></div>
            <div className="h-8 w-24 rounded-md bg-gray-200 animate-pulse"></div>
          </div>
        ) : session == null ? (
          <div className="hidden md:flex gap-3">
            <LoginModal />
            <RegistrationModal />
          </div>
        ) : (
          <div className="hidden md:block">
            <ProfileDropdown user={session?.user} logout={logout} />
          </div>
        )}

        {/* Mobile Hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition">
              <Menu className="h-6 w-6 text-black" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="text-white shadow-2xl overflow-y-auto w-[280px] sm:w-[300px] h-full flex flex-col"
            style={{
              background:
                "linear-gradient(145deg, #0F2027 0%, #2C5364 50%, #4E1B1B 100%)",
            }}
          >
            {/* Logo / Header */}
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-white/10">
              <SheetTitle className="flex items-center gap-2">
                <AlphaFitness className="text-[26px]" />
              </SheetTitle>
            </SheetHeader>

            {/* Navigation */}
            <nav className="flex flex-col gap-4 text-lg p-6">
              {menus.map((menu, index) => (
                <SheetClose asChild key={index}>
                  <Link
                    href={menu.path}
                    scroll={false}
                    onClick={(e) => handleSmoothScroll(e, menu.path)}
                    className="group relative font-arone tracking-wide hover:text-secondary transition"
                  >
                    {menu.title}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            {/* Auth Buttons (Mobile) */}
            <div className="px-6 pb-6 border-b border-white/10">
              {loading ? (
                <div className="flex flex-col gap-2">
                  <div className="h-10 w-full bg-white/20 rounded-md animate-pulse"></div>
                  <div className="h-10 w-full bg-white/20 rounded-md animate-pulse"></div>
                </div>
              ) : session == null ? (
                <div className="flex flex-col gap-3">
                  <LoginModal />
                  <RegistrationModal />
                </div>
              ) : (
                <div className="flex items-center gap-3 py-2">
                  <ProfileDropdown user={session?.user} logout={logout} mobile />
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-sm">
                      {session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0]}
                    </span>
                    <span className="text-white/60 text-xs">
                      {session?.user?.email}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="px-6 py-4 text-xs text-white/60 mt-auto">
              <p>
                &copy; {new Date().getFullYear()} Alpha Fitness. All rights
                reserved.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}