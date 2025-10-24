"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Settings, Package, LogOut, ChevronDown, User2 } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

/**
 * Props:
 * - sidebarSelector: CSS selector for your sidebar container. Default: '[data-sidebar]'
 *   Add data-sidebar to your drawer root: <aside data-sidebar className="...">...</aside>
 */
export default function ProfileDropdown({
  logout,
  user,
  className,
  mobile = true,
  sidebarSelector = "[data-sidebar]",
}) {
  const username =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const email = user?.email || user?.user_metadata?.email || "";

  const triggerRef = useRef(null);
  const [menuWidth, setMenuWidth] = useState(undefined);

  useEffect(() => {
    const updateWidth = () => {
      const triggerEl = triggerRef.current ;
      if (!triggerEl) return;

      // 1) Try to match sidebar width if we can find it
      const sidebar =
        document.querySelector(sidebarSelector) ||
        triggerEl.closest(sidebarSelector);

      if (sidebar instanceof HTMLElement) {
        // subtract sidebar horizontal padding if you want inside-edge fit
        const sidebarRect = sidebar.getBoundingClientRect();
        setMenuWidth(Math.round(sidebarRect.width));
        return;
      }

      // 2) Fallback: match the trigger's parent width
      const parent = triggerEl.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        setMenuWidth(Math.round(rect.width));
        return;
      }

      // 3) Last resort: trigger width
      setMenuWidth(Math.round(triggerEl.getBoundingClientRect().width));
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [sidebarSelector]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={triggerRef}
          variant="ghost"
          className={clsx(
            "w-full h-10 px-3 justify-between rounded-xl",
            "bg-white/10 hover:bg-white/15 active:bg-white/20",
            "backdrop-blur-md ring-1 ring-white/15",
            "text-white font-medium",
            "transition-all duration-200",
            className
          )}
          aria-label="Menu"
        >
          <span className="inline-flex items-center gap-2">
            <User2 className="size-4 opacity-90" />
            <span>Menu</span>
          </span>
          <ChevronDown className="size-4 opacity-80" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        // Align to the left edge of the trigger/sidebar
        align="start"
        side="bottom"
        sideOffset={8}
        // Make the width match the sidebar (dynamic)
        style={menuWidth ? { width: `${menuWidth}px` } : undefined}
        className={clsx(
          "rounded-xl overflow-hidden",
          "bg-zinc-900/90 backdrop-blur-xl",
          "border border-white/10",
          "shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
          // ensure it doesn't exceed viewport on tiny screens
          "max-w-[calc(100vw-1rem)]"
        )}
      >
        <DropdownMenuLabel className="px-4 py-3">
          <div className="flex flex-col">
            <span className="text-white text-sm font-semibold tracking-wide">
              {username}
            </span>
            {email && (
              <span className="text-xs text-zinc-300/80 truncate">
                {email}
              </span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem asChild className="group px-4 py-2.5 text-zinc-200 focus:bg-white/10">
          <Link href="/profile" className="flex items-center gap-3 w-full">
            <div className="size-7 grid place-items-center rounded-md bg-white/5 group-data-[highlighted]:bg-white/10">
              <Settings className="size-4" />
            </div>
            <span className="text-sm">Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="group px-4 py-2.5 text-zinc-200 focus:bg-white/10">
          <Link href="/services" className="flex items-center gap-3 w-full">
            <div className="size-7 grid place-items-center rounded-md bg-white/5 group-data-[highlighted]:bg-white/10">
              <Package className="size-4" />
            </div>
            <span className="text-sm">Services</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          onClick={logout}
          className="px-4 py-2.5 text-red-300 focus:bg-red-500/10"
        >
          <div className="flex items-center gap-3">
            <div className="size-7 grid place-items-center rounded-md bg-red-500/15">
              <LogOut className="size-4" />
            </div>
            <span className="text-sm">Logout</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
