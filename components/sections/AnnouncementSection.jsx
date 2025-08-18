"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { announcements } from "@/constant/announcements";
import { Sparkles } from "lucide-react";

// ✅ Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

const gradients = [
  "bg-gradient-to-br from-red-500 via-pink-600 to-red-700",
  "bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700",
  "bg-gradient-to-br from-green-500 via-emerald-600 to-green-700",
  "bg-gradient-to-br from-violet-500 via-purple-600 to-violet-700",
];

export default function AnnouncementSection() {
  return (
    <div className="relative w-full screen ">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 mb-12 px-4 text-center">
        {/* Heading with Icon */}
        <motion.div
          className="flex items-center gap-3 sm:gap-4"
          initial={{ opacity: 0, x: -80 }} // slide from left
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 lg:h-[50px] lg:w-[50px] text-secondary animate-bounce" />
          <h1 className="font-russo text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-secondary leading-tight">
            Upcoming Events
          </h1>
        </motion.div>

        {/* Subtext */}
        <motion.div
          className="max-w-xl text-sm sm:text-base md:text-lg lg:text-xl font-bold font-arone opacity-80"
          initial={{ opacity: 0, x: 80 }} // slide from right
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <span>
            Don&apos;t miss out on our{" "}
            <span className="text-secondary">exciting events</span>{" "}
            <br className="hidden sm:block" />
            and promotions designed to enhance your fitness journey
          </span>
        </motion.div>
      </div>

      {/* ✅ Swiper Carousel */}
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {announcements.map((data, index) => {
          const bg = data?.background || gradients[index % gradients.length];

          return (
            <SwiperSlide key={data.id}>
              {/* ✅ Wrap Card in Motion */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1, // staggered delay for smooth feel
                  ease: "easeOut",
                }}
                viewport={{ once: false, amount: 0.2 }}
                whileHover={{ scale: 1.1 }} // ✅ still allows hover scaling
              >
                <Card
                  className={`relative rounded-3xl p-6 text-white shadow-2xl ${bg} flex flex-col justify-between min-h-[400px]`}
                >
                  {/* Logo */}
                  {data?.logos?.main && (
                    <div className="flex justify-center mb-6">
                      <Image
                        src={data.logos.main.replace("/public", "")}
                        alt="Alpha Fitness Logo"
                        width={90}
                        height={90}
                        className="object-contain rounded-full border-4 border-white shadow-lg"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-extrabold tracking-tight">
                      {data?.title || "No Title"}
                    </CardTitle>
                    {data?.subtitle && (
                      <p className="text-lg italic opacity-90">
                        {data.subtitle}
                      </p>
                    )}
                  </CardHeader>

                  {/* Content */}
                  <CardContent className="space-y-4">
                    {/* Offers */}
                    {data?.offers?.length > 0 ? (
                      <div className="space-y-2">
                        {data.offers.map((offer, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-lg font-medium"
                          >
                            <span>{offer.name}</span>
                            <span className="font-bold text-yellow-300">
                              {offer.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <h2 className="text-3xl font-bold">{data?.price}</h2>
                        <p className="text-lg">{data?.offer}</p>
                        <p className="text-md italic">{data?.duration}</p>
                        <p className="text-sm opacity-80">
                          {data?.promo_period}
                        </p>
                      </>
                    )}

                    {/* Classes */}
                    {data?.classes_included?.length > 0 && (
                      <p className="text-sm">
                        <span className="font-bold">Classes:</span>{" "}
                        {data.classes_included.join(", ")}
                      </p>
                    )}

                    {/* Perks */}
                    {data?.perks?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {data.perks.map((perk, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm"
                          >
                            {perk?.logo && (
                              <Image
                                src={perk.logo.replace("/public", "")}
                                alt={perk.name}
                                width={18}
                                height={18}
                                className="object-contain"
                              />
                            )}
                            <span>
                              {perk.name} – {perk.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA Button */}
                    {data?.cta && (
                      <div className="flex justify-center">
                        <Button
                          variant="secondary"
                          className="text-white w-full py-4 text-lg rounded-full shadow-lg"
                          onClick={() => (window.location.href = data.cta.url)}
                        >
                          {data.cta.text}
                        </Button>
                      </div>
                    )}

                    {/* Small Print */}
                    {data?.small_print && (
                      <p className="text-xs opacity-80 text-center mt-4">
                        {data.small_print}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
