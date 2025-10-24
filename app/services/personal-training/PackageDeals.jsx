"use client";
import React, { useEffect, useState } from "react";
import { packageSession } from "@/constant/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function PackageDeals() {
  const router = useRouter();
  const { user } = useAuth();

  // ✅ match your Postgres enum labels
  const TRAINING_TYPES = {
    PACKAGE_12: "package_12",
  };

  const sanitizePrice = (val) =>
    typeof val === "number" ? val : Number(String(val).replace(/[^0-9.]/g, ""));

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
        window.location.href = data.url; // Stripe
      } else if (data.status === "pending") {
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
    <div className="screen flex flex-col justify-center w-full items-center gap-6 sm:gap-8">
      <span className="font-russo text-xl sm:text-2xl text-center">
        Package Deals (12 Sessions)
      </span>

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
        {packageSession.map((training, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <Card className="relative justify-between p-4 sm:p-5 overflow-hidden gradient-border">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-lg w-fit">
                  <Image
                    src={training.logo}
                    alt={training.title}
                    height={50}
                    width={50}
                  />
                </div>
                <CardTitle className="text-lg sm:text-2xl font-russo">
                  {training.title}
                </CardTitle>
                <CardDescription className="hidden">
                  Get your Alpha Fitness keycard without any services loaded
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center space-y-6">
                <div className="space-y-1 font-arone">
                  <div className="text-2xl sm:text-4xl font-russo text-secondary">
                    {training.price}
                  </div>
                  <p className="text-xs sm:text-sm text-primary font-arone">
                    {training.session}
                  </p>
                </div>

                <div className="text-left">
                  <Button
                    variant="ghost"
                    className="bg-[#22C55E]/30 border-[#22C55E] border-2 rounded-4xl text-[#16A34A]"
                    size="sm"
                  >
                    {training.perSession}
                  </Button>
                </div>

                <div className="space-y-3">
                  {training.features?.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-left">
                      <Check className="h-5 w-5 text-Green flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-4 flex flex-col gap-4 ">
                <div className="flex-1 w-full">
                  <Button
                    variant="secondary"
                    className="text-white w-full text-sm sm:text-base"
                    onClick={() =>
                      handleCheckout(
                        TRAINING_TYPES.PACKAGE_12,
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
                        TRAINING_TYPES.PACKAGE_12,
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
