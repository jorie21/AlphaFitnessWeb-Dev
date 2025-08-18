'use client'
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { testimonials } from '@/constant/features';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";

export default function TestimonialSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-10 bg-gradient-to-b from-[#0F2027] via-[#1E3A46] to-[#2C5364] text-white">
      <div className="container px-4 md:px-6 mx-auto">
        
        {/* Heading */}
        <motion.div
          className='flex flex-col items-center justify-center gap-6 text-center mb-12'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className='flex flex-row items-center justify-center gap-3'>
            <Star size={25} color="#FFA807" fill="#FFA807" />
            <h2 className="text-[#FFA807] font-bold text-lg tracking-wider uppercase">TESTIMONIAL</h2>
          </div>
          <h1 className="font-russo text-4xl md:text-5xl lg:text-6xl leading-tight">
            What Our Members Say
          </h1>
          <p className='text-lg md:text-xl opacity-80 max-w-3xl'>
            Real stories from real people who transformed their lives at Alpha Fitness
          </p>
        </motion.div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
          }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false, 
              stopOnMouseEnter: true, 
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((t, idx) => (
              <CarouselItem 
                key={t.id} 
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 40 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <Card className="rounded-xl border border-white/10 bg-gradient-to-b from-[#0F2027] via-[#1E3A46] to-[#2C5364] p-6 text-white shadow-lg h-full flex flex-col justify-between">
                    <CardContent className="flex flex-col gap-4 p-0">
                      
                      {/* ⭐ Star Rating */}
                      <div className="flex gap-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>

                      {/* Testimonial Text */}
                      <blockquote className="text-base leading-relaxed text-gray-200 flex-grow">
                        “{t.testimonial}”
                      </blockquote>

                      {/* Author */}
                      <figcaption className="flex gap-3 pt-4 border-t border-white/10 mt-4">
                        <Image
                          src={t.image || "/placeholder.svg"}
                          alt={t.name}
                          width={40}
                          height={40}
                          className="rounded-full border border-white/20 object-cover"
                        />
                        <div>
                          <p className="font-semibold text-base">{t.name}</p>
                          <p className="text-xs text-gray-400">{t.role}</p>
                        </div>
                      </figcaption>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex text-white bg-transparent" />
          <CarouselNext className="hidden sm:flex text-white bg-transparent" />
        </Carousel>
      </div>
    </section>
  );
}
