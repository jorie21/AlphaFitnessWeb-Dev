"use client";
import React from "react";
import { personalTraining } from "@/constant/services";
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

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function PackageDeals() {
  return (
    <div className="screen flex flex-col justify-center w-full items-center gap-6 sm:gap-8">
      <span className="font-russo text-xl sm:text-2xl text-center">
        Package Deals (12 Sessions)
      </span>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000 }}
        loop={true}
        spaceBetween={16} 
        breakpoints={{
          0: { slidesPerView: 1, centeredSlides: true }, // Mobile
          1024: { slidesPerView: 3, centeredSlides: false }, // Desktop (lg:)
        }}
        className="w-full"
      >
        {personalTraining.map((training, index) => (
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

              <CardFooter className="pt-4">
                <div className="flex-1">
                  <Button
                    variant="secondary"
                    className="text-white w-full text-sm sm:text-base"
                  >
                    Book Package
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
