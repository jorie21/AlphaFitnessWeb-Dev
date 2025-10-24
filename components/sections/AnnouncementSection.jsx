"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function AnnouncementSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch("/api/announcements?limit=30", { cache: "no-store" });
        const json = await res.json();
        if (!cancel) setItems(json.announcements || []);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  return (
    <section className="w-full p-10">
      {/* align with top navbar/logo */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-8 w-8 text-secondary" />
            <h2 className="font-russo text-3xl md:text-4xl text-secondary">Upcoming Events</h2>
          </motion.div>
          <p className="text-sm md:text-base font-arone">
            Don&apos;t miss out on our <span className="text-secondary font-semibold">exciting events</span> and promotions!
          </p>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="h-[420px] md:h-[500px] w-full rounded-2xl bg-muted/30 animate-pulse" />
        )}

        {/* Carousel */}
        {!loading && items.length > 0 && (
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500 }}
            loop
            spaceBetween={24}                 // <- GAP BETWEEN SLIDES
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-10"                  // space for dots
          >
            {items.map((a) => (
              <SwiperSlide key={a.id}>
                {/* ONE SIMPLE FRAME PER SLIDE */}
                <div className="relative h-[420px] md:h-[500px] rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-lg">
                  <Image
                    src={a.image_url}
                    alt={a.alt || "Announcement"}
                    fill
                    className="object-contain" // keep full poster visible
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </div>
              </SwiperSlide>
            ))}
            <div className="mt-10"></div>
          </Swiper>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div className="h-[420px] md:h-[500px] w-full rounded-2xl bg-muted/20 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No announcements yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
