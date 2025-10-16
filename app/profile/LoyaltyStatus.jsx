"use client";
import React, { useEffect, useState } from "react";
import { GiAchievement } from "react-icons/gi";
import { loyaltyStatus } from "@/constant/profile";
import { useAuth } from "@/context/authContext";

export default function LoyaltyStatus({ onStatusChange }) {
  const { user } = useAuth();
  const [status, setStatus] = useState("Bronze");
  const [purchases, setPurchases] = useState(0);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) return;
      const res = await fetch("/api/loyalty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (data.status) {
        setStatus(data.status);
        setPurchases(data.totalPurchases);
        onStatusChange?.(data.status);
      }
    };
    fetchStatus();
  }, [user]);

  const progress = Math.min((purchases / 10) * 100, 100);
  const purchasesLeft = Math.max(10 - purchases, 0);

  return (
    <section className="shadow-xl rounded-lg flex flex-col p-6 sm:p-8 w-full bg-white">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex gap-2 items-center">
          <GiAchievement className="h-10 w-10 sm:h-12 sm:w-12 text-[#FFA807]" />
          <div>
            <h1 className="font-russo text-xl sm:text-2xl">
              Loyalty Status: <span className="text-[#FFA807]">{status}</span>
            </h1>
            <span className="text-black/70 font-arone text-xs sm:text-sm">
              Earn rewards based on your purchases
            </span>
          </div>
        </div>

        {/* Bronze / Silver / Gold cards */}
        <div className="flex flex-col md:flex-row gap-4">
          {loyaltyStatus.map((item, index) => {
            const bgClass =
              item.title === "Bronze"
                ? "bg-[rgba(205,127,50,0.3)] border-[#CD7F32]"
                : item.title === "Silver"
                ? "bg-[rgba(192,192,192,0.3)] border-[#C0C0C0]"
                : "bg-[rgba(255,215,0,0.3)] border-[#FFA807]";

            // highlight active tier
            const isActive = item.title === status;

            return (
              <div
                key={index}
                className={`flex flex-col justify-center items-center border-2 ${bgClass} rounded-lg p-4 flex-1 transition-transform ${
                  isActive ? "scale-105 border-4" : "opacity-70"
                }`}
                style={{
                  boxShadow: "inset 0px 4px 90px rgba(0, 0, 0, 0.25)",
                }}
              >
                <item.icon
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  style={{ color: item.color }}
                />
                <span
                  className="font-russo text-lg sm:text-2xl"
                  style={{ color: item.color }}
                >
                  {item.title}
                </span>
                <span className="text-black/70 font-arone text-xs sm:text-sm text-center">
                  {item.description}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div
          className="w-full rounded-lg border-2 p-4 border-[#FFA807] bg-[rgba(255,215,0,0.3)]"
          style={{
            boxShadow: "inset 0px 4px 90px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span className="font-russo text-base sm:text-lg">
                Progress to Gold
              </span>
              <span className="font-arone text-sm">
                {purchases}/10 purchases
              </span>
            </div>

            <div className="w-full bg-white/60 rounded-full h-2 sm:h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 sm:h-3 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <span className="font-arone text-xs sm:text-sm">
              {purchasesLeft > 0
                ? `Only ${purchasesLeft} more purchases until Gold!`
                : "🎉 You've unlocked Gold benefits!"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
