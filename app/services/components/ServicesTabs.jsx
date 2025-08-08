"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ServicesTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState("keycards");

  useEffect(() => {
    if (pathname === "/services") setCurrentTab("keycards");
    else if (pathname.includes("gym-membership")) setCurrentTab("gym");
    else if (pathname.includes("group-classes")) setCurrentTab("group");
    else if (pathname.includes("personal-training")) setCurrentTab("personal");
    else setCurrentTab("keycards");
  }, [pathname]);

  const handleTabChange = (value) => {
    setCurrentTab(value);
    switch (value) {
      case "keycards":
        router.push("/services");
        break;
      case "gym":
        router.push("/services/gym-membership");
        break;
      case "group":
        router.push("/services/group-classes");
        break;
      case "personal":
        router.push("/services/personal-training");
        break;
    }
  };

  return (
    <div className="w-full screen relative">
      {/* Desktop Tabs */}
      <div className="hidden sm:block">
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="w-full flex">
            <TabsTrigger value="keycards" className="flex-1">
              Keycards
            </TabsTrigger>
            <TabsTrigger value="gym" className="flex-1">
              Gym Membership
            </TabsTrigger>
            <TabsTrigger value="group" className="flex-1">
              Group Classes
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex-1">
              Personal Training
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Dropdown */}
      <div className="block sm:hidden">
        <div className="relative w-full">
          <select
            value={currentTab}
            onChange={(e) => handleTabChange(e.target.value)}
            className="appearance-none w-full border border-gray-400 rounded-lg py-2 pl-4 pr-10 bg-white text-gray-700 font-arone focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="keycards">Keycards</option>
            <option value="gym">Gym Membership</option>
            <option value="group">Group Classes</option>
            <option value="personal">Personal Training</option>
          </select>

          {/* Chevron Icon */}
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
