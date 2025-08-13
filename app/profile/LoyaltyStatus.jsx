import React from "react";
import { GiAchievement } from "react-icons/gi";
import { loyaltyStatus } from "@/constant/profile";
import { Target } from "lucide-react";

export default function LoyaltyStatus() {
  return (
    <section className="shadow-xl rounded-lg flex flex-col p-8 w-full bg-white">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex gap-2 items-center">
          <GiAchievement className="h-12 w-10 text-[#FFA807]" />
          <div>
            <h1 className="font-russo text-2xl">Loyalty Status</h1>
            <span className="text-black/70 font-aron text-sm">
              Earn rewards based on your service purchases
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="flex gap-4 justify-between items-center">
          {loyaltyStatus.map((item, index) => {
            const bgClass =
              item.title === "Bronze"
                ? "bg-[rgba(205,127,50,0.3)] border-[#CD7F32]"
                : item.title === "Silver"
                ? "bg-[rgba(192,192,192,0.3)] border-[#C0C0C0]"
                : "bg-[rgba(255,215,0,0.3)] border-[#FFA807]";

            return (
              <div
                key={index}
                className={`flex flex-col justify-center w-full space-y-2 items-center border-2 ${bgClass} rounded-lg p-4`}
                style={{
                  boxShadow: "inset 0px 4px 90px rgba(0, 0, 0, 0.25)",
                }}
              >
                <item.icon
                  className="w-8 h-8  text-white"
                  style={{ color: item.color }}
                />
                <span
                  className="font-russo text-2xl"
                  style={{ color: item.color }}
                >
                  {item.title}
                </span>

                <span className="text-black/70 font-arone text-xs">
                  {item.description}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div
          className="w-full rounded-lg border-2 border-[#FFA807] bg-[rgba(255,215,0,0.3)]"
          style={{
            boxShadow: "inset 0px 4px 90px rgba(0, 0, 0, 0.25)",
          }}
        >
           <Target className="w-5 h-5 text-purple-500" />

        </div>
      </div>
    </section>
  );
}
