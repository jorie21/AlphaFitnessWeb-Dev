//app/services/personal-training/FitnessTrainingCoach.jsx
"use client";
import React from "react";
import { fitnessCoach } from "@/constant/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import coach from "@/public/icons/coach.png";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";


export default function FitnessTrainingCoach() {
  return (
    <div className="screen flex flex-col justify-center w-full items-center gap-6 sm:gap-8">
      <span className="font-russo text-xl sm:text-2xl text-center">
        Fitness Training Coach
      </span>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000 }}
        loop={true}
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
              {/* Header */}
              <CardHeader className="place-items-center">
                <div className="mx-auto mb-4 p-3 rounded-lg w-fit">
                  <Image src={coach} alt="coach" width={50} height={50} />
                </div>
                <CardTitle className="font-russo text-lg sm:text-2xl text-center">
                  {fit.session}
                </CardTitle>
              </CardHeader>

              {/* Content */}
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

                <Button
                  variant="secondaryBlue"
                  className="text-white bg-Blue w-full mt-4"
                >
                  Book Fitness Coach
                </Button>
              </CardContent>
            </Card>
            <div className="pt-10"></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
