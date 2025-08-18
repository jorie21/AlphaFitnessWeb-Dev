import React from "react";
import ProfileHeader from "./ProfileHeader";
import LoyaltyStatus from "./LoyaltyStatus";
import NutritionCard from "./NutritionCard";

export default function page() {
  return (
    <div>
      <ProfileHeader />
      <div className="flex flex-col lg:flex-row gap-4 screen">
        <LoyaltyStatus />
        <NutritionCard />
      </div>
    </div>
  );
}
