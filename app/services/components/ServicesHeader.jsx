import React from "react";
import AlphaFitness from "@/components/Alphafitness";
import { motion } from "framer-motion";

export default function ServicesHeader() {
  return (
    <header className="relative h-auto w-full flex flex-col bg-gradient-to-br from-[#D9D9D9] via-[#E8E8E8] to-[#F5F5F5]  sm:p-6 lg:p-8 justify-center items-center overflow-hidden">
      <div className="flex flex-col gap-6 sm:gap-8 items-center p-6 sm:p-8 lg:p-10 relative z-10">
        <motion.div
          className="flex items-center gap-3 sm:gap-4"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className="flex gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-russo items-center">
            <AlphaFitness />
            <h1>Services</h1>
          </div>
        </motion.div>

        <motion.div
          className="text-center max-w-xs sm:max-w-md lg:max-w-2xl lg:text-center lg:text-[20px] font-bold font-arone opacity-70"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <p className="text-base leading-relaxed max-w-prose text-center opacity-70 ">
            Start with a keycard, then choose from our premium fitness services
            including gym access, group classes, and personal training.
          </p>
        </motion.div>
      </div>

      {/* Bottom subtle overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 bg-gradient-to-t from-white/30 to-transparent"></div>
    </header>
  );
}
