"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Check } from "lucide-react";
import { MembershipPlans } from "@/constant/services";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";

export default function GymMembershipPage() {
  const { user } = useAuth();

  // track keycard availability
  const [hasKeycard, setHasKeycard] = useState(null); // null=unknown
  const [checkingKeycard, setCheckingKeycard] = useState(false);

  // check if user has any keycard (uses your /api/keycards/get POST)
  useEffect(() => {
    const checkKeycard = async () => {
      if (!user) {
        setHasKeycard(null);
        return;
      }
      setCheckingKeycard(true);
      try {
       const res = await fetch("/api/keycards/get", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userId: user.id, type: "check" }), // ✅ neutral check
});
        const data = await res.json().catch(() => ({}));

        // Prefer the explicit boolean if present; fall back to array length
        const any =
          typeof data?.hasKeycard === "boolean"
            ? data.hasKeycard
            : Array.isArray(data?.keycards) && data.keycards.length > 0;

        setHasKeycard(any);
      } catch (e) {
        console.error("Keycard check failed:", e);
        setHasKeycard(false);
      } finally {
        setCheckingKeycard(false);
      }
    };
    checkKeycard();
  }, [user]);

  // hard guard used by both handlers
  const guardRequiresKeycard = () => {
    if (!user) {
      toast.error("Sign in first!");
      return false;
    }
    if (checkingKeycard) {
      toast.message("Checking your keycard status…");
      return false;
    }
    if (hasKeycard === false) {
      toast.error(
        "You need an Alpha Fitness keycard before purchasing a membership."
      );
      return false;
    }
    // allow if hasKeycard === true (or null, but we blocked null above while checking)
    return true;
  };

  // Online checkout (Stripe)
  const handleCheckout = async (plan) => {
    if (!guardRequiresKeycard()) return;

    try {
      const res = await fetch("/api/services/membership/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          plan,
          paymentMethod: "online",
        }),
      });

      const data = await res.json().catch(() => {
        throw new Error("Invalid server response");
      });

      if (data?.error?.includes("already have an active membership")) {
        return toast.error(
          "You already have an active membership. Please wait until it expires."
        );
      }

      if (!res.ok) throw new Error(data?.error || "Checkout failed");

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  // OTC checkout
  const handleOTCCheckout = async (plan) => {
    if (!guardRequiresKeycard()) return;

    try {
      const res = await fetch("/api/services/membership/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, plan, paymentMethod: "otc" }),
      });

      const data = await res.json().catch(() => {
        throw new Error("Invalid server response");
      });

      if (data?.error?.includes("already have an active membership")) {
        return toast.error(
          "You already have an active membership. Please wait until it expires."
        );
      }

      if (!res.ok) throw new Error(data?.error || "OTC Checkout failed");

      toast.success("✅ OTC membership request submitted! Pending approval.");
    } catch (err) {
      console.error("OTC Checkout Error:", err);
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  return (
    <section className="screen flex flex-col justify-center items-center gap-8">
      <div className="text-center space-y-2">
        <h1 className="font-russo text-3xl">Gym Membership Plans</h1>
        <p className="text-base leading-relaxed max-w-prose font-arone opacity-70">
          Unlimited gym and jogging access with our soft opening promo rates!
        </p>
      </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={true}
        breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
        className="w-full px-8"
      >
        {MembershipPlans.map((Membership, index) => (
          <SwiperSlide key={index}>
            <Card className="relative overflow-hidden rounded-xl shadow-md h-full gradient-border">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15 z-0">
                <Image
                  src={"/ALPHAFIT.LOGO.png"}
                  alt="alphFitness"
                  height={500}
                  width={300}
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-lg w-fit">
                    <Dumbbell className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="text-2xl font-russo">
                    {Membership.title}
                  </CardTitle>
                  <CardDescription className="hidden">
                    Get your Alpha Fitness keycard without any services loaded
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-center space-y-6">
                  <div className="text-4xl font-russo text-secondary">
                    {Membership.Price}
                  </div>

                  <div className="space-y-3 text-left">
                    {Membership.features?.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    {/* NO disabled props—clicks are allowed; guard handles toasts */}
                    <Button
                      variant="secondary"
                      className="text-white w-full"
                      onClick={() => handleCheckout(Membership)}
                      disabled={true}
                    >
                      Pay Online
                      Under Maintenance
                    </Button>
                    <Button
                      variant="outlineSecondary"
                      className="w-full text-secondary"
                      onClick={() => handleOTCCheckout(Membership)}
                    >
                      Pay On the Counter
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
            <div className="mt-10"></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
