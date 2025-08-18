import React from "react";
import { GiAchievement } from "react-icons/gi";
import { loyaltyStatus } from "@/constant/profile";

export default function LoyaltyStatus() {
  return (
    <section className="shadow-xl rounded-lg flex flex-col p-6 sm:p-8 w-full bg-white">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex gap-2 items-center">
          <GiAchievement className="h-10 w-10 sm:h-12 sm:w-12 text-[#FFA807]" />
          <div>
            <h1 className="font-russo text-xl sm:text-2xl">Loyalty Status</h1>
            <span className="text-black/70 font-arone text-xs sm:text-sm">
              Earn rewards based on your service purchases
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-4">
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
                className={`flex flex-col justify-center items-center border-2 ${bgClass} rounded-lg p-4 flex-1`}
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
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <div className="flex flex-col">
                <span className="font-russo text-base sm:text-lg">
                  Progress to Gold
                </span>
                <span className="font-arone text-xs sm:text-sm opacity-70">
                  4 out of 10 purchases
                </span>
              </div>

              <div className="flex flex-col text-left sm:text-right">
                <span className="font-russo text-base sm:text-lg">6</span>
                <span className="text-xs sm:text-sm font-arone">
                  Purchases Left
                </span>
              </div>
            </div>

            <div className="w-full bg-white/60 rounded-full h-2 sm:h-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 sm:h-3 rounded-full w-1/2"></div>
            </div>

            <span className="font-arone text-xs sm:text-sm">
              Only <span className="text-secondary">6 more purchases</span>{" "}
              until you unlock Gold benefits!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
