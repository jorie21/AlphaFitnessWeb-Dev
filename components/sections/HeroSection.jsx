'use client'
import React from 'react'
import ImageSlider from '../ImageSlider';
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";


export default function HeroSection() {
  return (
    <section id='' className="relative w-full  lg:h-screen ">
    
        <ImageSlider />

        {/* 🌟 Mobile Layout (Full Screen) */}
        
        <div className="relative flex justify-center items-center z-20 lg:hidden">
        <div
            className="bg-white/20 backdrop-blur-md rounded-3xl p-6 text-center text-black shadow-xl"
            style={{ maxWidth: "500px" }}
        >
            <div className="flex justify-center mb-4">
            <Sparkles className="h-10 w-10 text-black animate-bounce" />
            </div>

            <h1 className="text-3xl font-russo">
            Train with <span className="text-primary">Purpose</span>
            </h1>
            <h1 className="text-3xl font-russo mt-2">
            Live with <span className="text-secondary">Power</span>
            </h1>
            <p className="mt-4 text-base font-arone leading-relaxed">
            Transform your body. Elevate your mind. Join our community of
            fitness enthusiasts and achieve your goals with state-of-the-art
            equipment and expert guidance.
            </p>

            {/* CTA Button */}
            <button className="mt-6 w-full px-6 py-3 bg-secondary text-white rounded-full text-lg font-arone shadow-lg hover:bg-secondary/90 transition">
            Start Your Journey!
            </button>
        </div>
        </div>

        {/* 🌟 Desktop Layout (Side by Side) */}
        <div className="absolute inset-0 hidden lg:flex justify-center screen items-center gap-48 text-black z-20">
        {/* ✅ Animated Text Content */}
        <motion.div
            className="flex flex-col justify-center gap-5"
            initial={{ opacity: 0, y: 50 }}      // Start hidden + slightly down
            whileInView={{ opacity: 1, y: 0 }}      // Fade in + slide up
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}  
        >
            <div className="flex items-center font-arone font-bold gap-2">
            <Sparkles className="h-[25px] text-black animate-pulse" />
            <h1 className="text-xl">Premium Fitness Experience</h1>
            </div>

            <div>
            <h1 className="text-5xl font-russo">
                Train with <span className="text-primary">Purpose</span>
            </h1>
            <h1 className="text-5xl font-russo">
                Live with <span className="text-secondary">Power</span>
            </h1>
            </div>

            <p className="text-lg font-arone leading-relaxed">
            Transform your body. Elevate your mind. Join our community <br /> of
            fitness enthusiasts and achieve your goals with state-of-the-art
            equipment and expert guidance.
            </p>
            <Button className="mt-6 w-[220] h-[50px] px-6 py-3 bg-secondary text-white rounded-2xl font-arone shadow-lg hover:bg-secondary/90 transition">
            Start Your Journey!
            </Button>
        </motion.div>

        {/* Logo */}
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: false, amount: 0.5 }}  
        >
            <Image
            src={"/ALPHAFIT.LOGO.png"}
            alt="Alpha Fitness Logo"
            width={500}
            height={500}
            />
        </motion.div>
        </div>
    </section>
  )
}
