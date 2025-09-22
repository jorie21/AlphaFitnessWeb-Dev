
import React from "react"
import AlphaFitness from "../Alphafitness"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { features, stats, featureSelection } from "@/constant/features"
import Image from "next/image"
import { motion } from "framer-motion"
import { UsersRound } from "lucide-react" // if you still use it in the header

export default function AboutSection() {
  return (
    <article id="about" className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 screen gap-8 lg:pt-20 md:pt-20">
      {/* Left */}
      <motion.div
        className="lg:col-span-1 flex flex-col gap-4 md:gap-8 lg:gap-3 h-full w-full"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <UsersRound size={28} color="black" fill="black" />
          <h1 className="text-secondary font-russo text-lg sm:text-xl">ABOUT</h1>
          <AlphaFitness className="text-lg sm:text-xl" />
        </div>

        <h1 className="font-russo text-3xl sm:text-4xl md:text-5xl leading-tight">
          Your Fitness Journey <br className="hidden sm:block" /> Starts Here
        </h1>

        <h2 className="text-lg sm:text-xl font-bold font-arone">Our Mission</h2>
        <p className="font-arone opacity-70 text-sm sm:text-base leading-relaxed">
          At Alpha Fitness, we believe that everyone deserves access to world-class fitness
          facilities and expert guidance. Our mission is to empower individuals to achieve their
          fitness goals through cutting-edge equipment, personalized training, and a supportive
          community atmosphere.
        </p>

        {/* Features Grid (the small boxes on left) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-full md:max-w-4xl h-full">
          {featureSelection.map((item, index) => (
            <motion.div
              key={index}
              className={`${item.bgColor} ${item.borderColor} p-4 rounded-xl shadow-md flex items-start gap-3`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="min-w-[36px] sm:min-w-[40px]">
                <Image src={item.icon} alt={item.title} width={36} height={36} />
              </div>
              <div>
                <h3 className="font-russo text-base sm:text-lg">{item.title}</h3>
                <p className="text-xs sm:text-sm font-arone opacity-70">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right */}
      <motion.div
        className="w-full h-full lg:col-span-1"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <Card className="bg-gradient-to-tl from-[#0F2027] via-[#2C5364] to-[#4E1B1B] text-white rounded-xl shadow-xl p-4 h-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Why choose Alpha Fitness?</CardTitle>
            <CardDescription className="text-gray-300 text-sm sm:text-base">
              We’re not just a gym – we’re your partner in transformation. Here’s what sets us apart from the rest.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-10">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  className="flex items-start gap-3 sm:gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                >
                  <div className="p-2 bg-white/10 rounded-full flex items-center justify-center">
                    <Icon className={`w-6 h-6 opacity-80 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="font-russo tracking-wide text-sm sm:text-base">{feature.title}</h3>
                    <p className="text-gray-300 text-xs sm:text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>

          <CardFooter className="border-t border-gray-500/40 pt-4 flex flex-wrap justify-between gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center flex-1"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
              >
                <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </CardFooter>
        </Card>
      </motion.div>
    </article>
  )
}
