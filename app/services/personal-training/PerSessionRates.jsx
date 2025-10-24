"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { user } = useAuth();

  // ✅ match your Postgres enum labels
  const TRAINING_TYPES = {
    PER_SESSION: "per_session",
  };

  const sanitizePrice = (val) =>
    typeof val === "number" ? val : Number(String(val).replace(/[^0-9.]/g, ""));

  // keycard check
  const [hasKeycard, setHasKeycard] = useState(null);
  const [checkingKeycard, setCheckingKeycard] = useState(false);

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
          body: JSON.stringify({ userId: user.id, type: "check" }),
        });
        const data = await res.json().catch(() => ({}));
        const any = Array.isArray(data?.keycards) && data.keycards.length > 0;
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

  const guardRequiresKeycard = () => {
    if (!user) {
      toast.error("Please log in first.");
      return false;
    }
    if (checkingKeycard || hasKeycard === null) {
      toast.message("Checking your keycard status…");
      return false;
    }
    if (hasKeycard === false) {
      toast.error(
        "You need an Alpha Fitness keycard before purchasing Personal Training."
      );
      return false;
    }
    return true;
  };

  const handleCheckout = async (trainingType, title, price, paymentMethod) => {
    if (!guardRequiresKeycard()) return;

    try {
      const priceNum = sanitizePrice(price);

      const res = await fetch("/api/services/personal-training/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          trainingType,
          title,
          price: priceNum,
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();

      if (data.url) {
        // Stripe online payment
        window.location.href = data.url;
      } else if (data.status === "pending" && data.reference_id) {
        toast.success(
          `Pay on Counter created!\nReference ID: ${data.reference_id}`
        );
        toast.success(
          `Creating a Receipt for\nReference ID: ${data.reference_id}`
        );
        router.push(
          `/payment/otcServicess?reference_id=${data.reference_id}&service=personal_training`
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
        loop
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
                        TRAINING_TYPES.PER_SESSION,
                        training.title,
                        training.price,
                        "online"
                      )
                    }
                    disabled={true}
                  >
                    Pay Online
                    Under Maintenance
                  </Button>
                </div>

                <div className="flex-1 w-full">
                  <Button
                    variant="outlineSecondary"
                    className="text-secondary w-full text-sm sm:text-base"
                    onClick={() =>
                      handleCheckout(
                        TRAINING_TYPES.PER_SESSION,
                        training.title,
                        training.price,
                        "counter"
                      )
                    }
                  >
                    Pay On the Counter
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
