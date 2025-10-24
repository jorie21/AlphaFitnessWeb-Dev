"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Settings, Package, LogOut } from "lucide-react";
import Link from "next/link";

export default function ProfileDropdown({ logout, user, mobile = false }) {
  const username =
    user?.user_metadata?.username || user?.email?.split("@")[0] || "User";
  const email = user?.email || user?.user_metadata?.email;

  // ✅ keep your original alignment logic
  const align = mobile ? "start" : "end";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-md text-white md:text-slate-900 hover:bg-white/10 md:hover:bg-slate-100 transition">
          <div className="w-8 h-8 rounded-full bg-white/20 md:bg-slate-200 flex items-center justify-center">
            <ChevronDown className="size-4 opacity-80" />
          </div>
          <span className="hidden md:inline font-medium">{username}</span>
        </button>
      </DropdownMenuTrigger>

      {/* ✅ only changed bg to white */}
      <DropdownMenuContent
        align={align}
        side="bottom"
        sideOffset={6}
        collisionPadding={8}
        className="w-[240px] rounded-lg border border-slate-200 bg-white text-slate-900 shadow-xl"
      >
        <div className="px-3 py-2">
          <div className="text-sm font-medium truncate">{username}</div>
          <div className="text-xs text-slate-500 truncate">{email}</div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="flex items-center gap-2 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900">
          <Link href="/profile">
            <Settings className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="flex items-center gap-2 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900">
          <Link href="/services">
            <Package className="size-4" />
            Services
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={logout}
          className="flex items-center gap-2 text-red-600 data-[highlighted]:bg-red-100 data-[highlighted]:text-red-700"
        >
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
