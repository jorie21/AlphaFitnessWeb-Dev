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
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import AlphaFitness from "@/components/Alphafitness";
import { menus } from "@/constant/menu";
import LoginModal from "./auth/LoginModal";
import RegistrationModal from "./auth/RegistrationModal";
import { useAuth } from "@/context/authContext";


export default function Topbar() {

  const { signOut, session  } = useAuth()

  const handleSmoothScroll = (e, path) => {
    if (path.startsWith("#")) {
      e.preventDefault(); // stop Next.js routing

      const targetId = path.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      history.replaceState(null, "", " ");
    }
  };

  const logout = (e) => {
    e.preventDefault()
    signOut()
  }


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
        {session == null ? (
          <div className="hidden md:flex gap-3">
            <LoginModal />
            <RegistrationModal />
          </div>
        ) : (
          <Button onClick={logout}>Logout</Button>
        )}

        {/* Mobile Hamburger */}
        <Sheet>
          {/* Menu Button */}
          <SheetTrigger asChild className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-white/10 transition">
              <Menu className="h-6 w-6 text-black" />
            </button>
          </SheetTrigger>

          {/* Drawer Content */}
          <SheetContent
            side="left"
            className="text-white  shadow-2xl overflow-y-auto w-[300px] h-full"
            style={{
              background:
                "linear-gradient(145deg, #0F2027 0%, #2C5364 50%, #4E1B1B 100%)",
            }}
          >
            {/* Logo / Header */}
            <SheetHeader className="px-8 pt-5 pb-3 border-b border-white/10">
              <SheetTitle className="flex items-center gap-2">
                <AlphaFitness className="text-[26px]" />
              </SheetTitle>
            </SheetHeader>

            {/* Navigation */}
            <nav className="flex flex-col gap-4 text-lg p-8">
              {menus.map((menu, index) => (
                <Link
                  key={index}
                  href={menu.path}
                  className="group relative font-arone tracking-wide"
                >
                  {menu.title}
                </Link>
              ))}
            </nav>

            {/* Call to Actions */}
            <div className="px-8 ">
              <div className="flex flex-col gap-3">
                <LoginModal>
                  <Button
                    variant="outlineSecondary"
                    className="w-full font-arone text-secondary hover:scale-[1.02] transition-transform"
                  >
                    Sign up
                  </Button>
                </LoginModal>
                <RegistrationModal>
                  <Button
                    variant="secondary"
                    className="w-full text-white font-arone hover:scale-[1.02] transition-transform"
                  >
                    Join Now
                  </Button>
                </RegistrationModal>
              </div>
            </div>

            {/* Footer Info */}
            <div className="px-8 pb-6 mt-6 text-sm text-white/60 border-t border-white/10">
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
