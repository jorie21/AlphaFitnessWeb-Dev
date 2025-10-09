//app/services/gym-membership/page.jsx
"use client";

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
const handleCheckout = async (plan) => {
  if (!user) return toast.error("Sign in first!");

  try {
    const res = await fetch("/api/service/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, plan }),
    });

    const data = await res.json().catch(() => {
      throw new Error("Invalid server response");
    });

    if (!res.ok) throw new Error(data?.error || "Checkout failed");

    window.location.href = data.url;
  } catch (err) {
    console.error("Checkout Error:", err);
    toast.error(err.message);
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
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
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

                  {/* ✅ Button now functional */}
                  <Button
                    variant="secondary"
                    className="text-white w-full mt-4"
                    onClick={() => handleCheckout(Membership)}
                  >
                    Select Plan
                  </Button>
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
