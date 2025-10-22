//app/services/personal-training/PerSessionRates.jsx
"use client";
import React from "react";
import { perSession } from "@/constant/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

export default function PerSessionRates() {
  const { user } = useAuth();
  const handleCheckout = async (trainingType, title, price, paymentMethod) => {
    if (!user) {
      toast.error("Please log in first.");
      return;
    }
    try {
      const res = await fetch("/api/services/personal-training/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          trainingType,
          title,
          price,
          paymentMethod,
        }),
      });
      if (!res.ok) {
        const errorText = await res.text(); // Fallback to text if not JSON
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }
      const data = await res.json(); // Now safe to parse
      if (data.url) {
        window.location.href = data.url; // Stripe redirect
      } else if (data.status === "pending") {
        toast.success(
          `Pay on Counter created!\nReference ID: ${data.reference_id}`
        );
      } else if (data.error) {
        toast.error(data.error);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(`Checkout failed: ${error.message}`);
    }
  };
  return (
    <div className="screen flex flex-col justify-center w-full items-center gap-8 space-y-5">
      <span className="font-russo text-2xl">Per Session Rates</span>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000 }}
        loop={true}
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 1, centeredSlides: true },
          1024: { slidesPerView: 3, centeredSlides: false },
        }}
        className="w-full"
      >
        {perSession.map((training, m) => (
          <SwiperSlide key={m} className="flex justify-center">
            <Card className="gradient-border w-full ">
              <CardHeader className="text-center">
                <CardTitle className="font-russo text-2xl">
                  {training.title}
                </CardTitle>
                <CardDescription className="hidden">hello</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-russo text-secondary">
                    {training.price}
                  </span>
                  <span className="text-primary font-arone">Per Session</span>
                  <span className="text-secondary font-arone font-semibold mt-5">
                    Perfect for beginners
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-4 flex flex-col gap-4 ">
                <div className="flex-1 w-full">
                  <Button
                    variant="secondary"
                    className="text-white w-full text-sm sm:text-base"
                    onClick={() =>
                      handleCheckout(
                        "packageDeal",
                        training.title,
                        training.price,
                        "online"
                      )
                    }
                    disabled={!user}
                  >
                    {!user ? "Please Login first" : "Pay Online"}
                  </Button>
                </div>

                <div className="flex-1 w-full">
                  <Button
                    variant="outlineSecondary"
                    className="text-secondary w-full text-sm sm:text-base"
                    onClick={() =>
                      handleCheckout(
                        "packageDeal",
                        training.title,
                        training.price,
                        "counter"
                      )
                    }
                    disabled={!user}
                  >
                    {!user ? "Please Login first" : "Pay On the Counter"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
            <div className="pt-10"></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
