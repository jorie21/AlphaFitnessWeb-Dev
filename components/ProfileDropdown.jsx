"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, Package, LogOut } from "lucide-react";
import Link from "next/link";

export default function ProfileDropdown({ logout, user }) {
  const username = user?.user_metadata?.username || user?.email?.split("@")[0] || "User";
  const email = user?.email || user?.user_metadata?.email;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-3 border-0 hover:bg-gray-100">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="size-4 text-gray-600" />
          </div>
          <span className="hidden md:inline font-medium">{username}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
          {email}
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-100">
            <Settings className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/services" className="flex items-center gap-2 hover:bg-gray-100">
            <Package className="size-4" />
            Services
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-red-600 hover:bg-red-50">
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}