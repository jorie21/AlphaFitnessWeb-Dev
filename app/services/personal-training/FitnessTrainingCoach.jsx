"use client";
import React, { useEffect, useState } from "react";
import { fitnessCoach } from "@/constant/services";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import coach from "@/public/icons/coach.png";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";

export default function FitnessTrainingCoach() {
  const router = useRouter();
  const { user } = useAuth();

  // ✅ match your Postgres enum labels
  const TRAINING_TYPES = {
    COACH: "coach",
  };

  const sanitizePrice = (val) =>
    typeof val === "number" ? val : Number(String(val).replace(/[^0-9.]/g, ""));

  // keycard gating
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
        window.location.href = data.url;
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
        Fitness Training Coach
      </span>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 1, centeredSlides: true },
          1024: { slidesPerView: 4, centeredSlides: false },
        }}
        className="w-full"
      >
        {fitnessCoach.map((fit, i) => (
          <SwiperSlide key={i} className="flex justify-center lg:gap-8">
            <Card className="gradientBlue-border p-5 flex flex-col w-full">
              <CardHeader className="place-items-center">
                <div className="mx-auto mb-4 p-3 rounded-lg w-fit">
                  <Image src={coach} alt="coach" width={50} height={50} />
                </div>
                <CardTitle className="font-russo text-lg sm:text-2xl text-center">
                  {fit.session}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-center space-y-6 flex-1">
                <span className="text-2xl sm:text-4xl font-russo text-Blue">
                  {fit.price}
                </span>
                <p className="text-sm text-Blue font-arone">Try it Out</p>

                <div className="space-y-2">
                  {fit.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3 text-left">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-4 flex flex-col gap-4 ">
                <div className="flex-1 w-full">
                  <Button
                    variant="secondaryBlue"
                    className="text-white w-full text-sm sm:text-base"
                    onClick={() =>
                      handleCheckout(
                        TRAINING_TYPES.COACH,
                        fit.session,
                        fit.price,
                        "online"
                      )
                    }
                    disabled={true}
                  >
                    Pay Online <br />
                    Under Maintenance
                  </Button>
                </div>

                <div className="flex-1 w-full">
                  <Button
                    variant="outlineSecondaryBlue"
                    className="text-Blue w-full text-sm sm:text-base"
                    onClick={() =>
                      handleCheckout(
                        TRAINING_TYPES.COACH,
                        fit.session,
                        fit.price,
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
