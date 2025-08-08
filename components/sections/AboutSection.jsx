import React from 'react'
import AlphaFitness from '../Alphafitness';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UsersRound } from "lucide-react";
import { features, stats, featureSelection } from "@/constant/features";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <article id="about" className=" grid  grid-cols-1 lg:grid-cols-2 md:grid-cols-2 screen gap-8 lg:pt-20 md:pt-20 ">
      {/* Left Container */}
      <div className="lg:col-span-1 flex flex-col gap-4 md:gap-8 lg:gap-3 h-full w-full">
        {/* Section Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <UsersRound size={28} color="black" fill="black" />
          <h1 className="text-secondary font-russo text-lg sm:text-xl">ABOUT</h1>
          <AlphaFitness className="text-lg sm:text-xl" />
        </div>

        {/* Title */}
        <h1 className="font-russo text-3xl sm:text-4xl md:text-5xl leading-tight">
          Your Fitness Journey <br className="hidden sm:block" /> Starts Here
        </h1>

        {/* Mission */}
        <h2 className="text-lg sm:text-xl font-bold font-arone">Our Mission</h2>
        <p className="font-arone opacity-70 text-sm sm:text-base leading-relaxed">
          At Alpha Fitness, we believe that everyone deserves access to world-class fitness
          facilities and expert guidance. Our mission is to empower individuals to achieve their
          fitness goals through cutting-edge equipment, personalized training, and a supportive
          community atmosphere.
        </p>

        {/* Features Grid */}
        <div className="
          grid 
          grid-cols-1 sm:grid-cols-2 
          gap-4 
          max-w-full md:max-w-4xl 
          h-full
        ">
          {featureSelection.map((item, index) => (
            <div
              key={index}
              className={`
                ${item.bgColor} ${item.borderColor} 
                p-4 rounded-xl shadow-md 
                flex items-start gap-3
              `}
            >
              <div className="min-w-[36px] sm:min-w-[40px]">
                <Image src={item.icon} alt={item.title} width={36} height={36} />
              </div>
              <div>
                <h3 className="font-russo text-base sm:text-lg">{item.title}</h3>
                <p className="text-xs sm:text-sm font-arone opacity-70">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Container */}
      <div className="w-full h-full lg:col-span-1">
        <Card className="
          bg-gradient-to-tl from-[#0F2027] via-[#2C5364] to-[#4E1B1B] 
          text-white rounded-xl shadow-xl  
          p-4 
          h-full
          flex flex-col
          justify-between
        ">
          {/* Header */}
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">
              Why choose Alpha Fitness?
            </CardTitle>
            <CardDescription className="text-gray-300 text-sm sm:text-base">
              We’re not just a gym – we’re your partner in transformation. Here’s what sets us apart from the rest.
            </CardDescription>
          </CardHeader>

          {/* Features */}
          <CardContent className="space-y-10">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 bg-white/10 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-russo tracking-wide text-sm sm:text-base">{feature.title}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Footer */}
          <CardFooter className="border-t border-gray-500/40 pt-4 flex flex-wrap justify-between gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center flex-1">
                <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-300">{stat.label}</p>
              </div>
            ))}
          </CardFooter>
        </Card>
      </div>
    </article>
  )
}
