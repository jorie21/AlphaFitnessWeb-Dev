"use client";
import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import LoyaltyStatus from "./LoyaltyStatus";
import NutritionCard from "./NutritionCard";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [loyaltyStatus, setLoyaltyStatus] = useState("Bronze");

  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  if (!user) return null;

  return (
    <div>
      <ProfileHeader />
      <div className="flex flex-col lg:flex-row gap-4 screen">
        <LoyaltyStatus onStatusChange={setLoyaltyStatus} />
        <NutritionCard isUnlocked={loyaltyStatus === "Gold"} />
      </div>
    </div>
  );
}
