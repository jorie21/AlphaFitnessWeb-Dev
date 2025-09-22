'use client'
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function NotFound() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="text-left"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Oops...
          </motion.h1>
          
          <motion.h2 
            className="text-2xl md:text-3xl font-semibold text-gray-600 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Page not found
          </motion.h2>
          
          <motion.p 
            className="text-gray-500 text-lg mb-8 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            It seems like you got lost during your fitness journey. Don&apos;t worry, even champions take wrong turns sometimes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link href="/" className="inline-block">
              <motion.button
                className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
              >
                <span className="flex items-center gap-2">
                  Go Back
                  <motion.span
                    animate={{ x: isHovering ? 4 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex justify-center items-center"
        >
          {/* Background shapes */}
          <div className="absolute inset-0">
            {/* Large pink circle */}
            <motion.div
              className="absolute top-12 right-8 w-64 h-64 bg-red-200 rounded-full opacity-60"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Medium pink circle */}
            <motion.div
              className="absolute bottom-16 left-8 w-40 h-40 bg-red-300 rounded-full opacity-50"
              animate={{
                scale: [1, 1.08, 1],
                rotate: [0, -3, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Small circles */}
            <motion.div
              className="absolute top-32 left-16 w-16 h-16 bg-red-400 rounded-full opacity-40"
              animate={{
                y: [-5, 5, -5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-32 right-16 w-12 h-12 bg-red-300 rounded-full opacity-50"
              animate={{
                y: [5, -5, 5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* 404 Text */}
          <motion.div
            className="absolute top-8 right-16 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="text-right">
              <div className="text-6xl font-bold text-gray-700">404</div>
              <div className="text-sm text-gray-500 mt-1">Page not found</div>
            </div>
          </motion.div>

          {/* Main Illustration - Fitness Characters */}
          <div className="relative z-20 flex items-center justify-center">
            {/* Gym Equipment */}
            <motion.div
              className="absolute -left-8 top-16"
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="w-16 h-24 bg-gray-700 rounded-t-full relative">
                <div className="w-20 h-4 bg-gray-600 rounded-full absolute -top-2 -left-2"></div>
                <div className="w-4 h-16 bg-gray-600 absolute top-4 left-6"></div>
              </div>
            </motion.div>

            {/* Character 1 - Weight Lifter */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {/* Head */}
              <div className="w-16 h-16 bg-amber-200 rounded-full mb-1 mx-auto relative">
                <div className="w-2 h-2 bg-gray-800 rounded-full absolute top-5 left-4"></div>
                <div className="w-2 h-2 bg-gray-800 rounded-full absolute top-5 right-4"></div>
                <div className="w-4 h-1 bg-gray-700 rounded absolute top-9 left-1/2 transform -translate-x-1/2"></div>
              </div>
              {/* Body */}
              <div className="w-12 h-20 bg-red-500 mx-auto rounded-t-lg relative">
                {/* Arms holding barbell */}
                <div className="absolute -left-4 top-4 w-8 h-3 bg-amber-200 rounded-full transform -rotate-12"></div>
                <div className="absolute -right-4 top-4 w-8 h-3 bg-amber-200 rounded-full transform rotate-12"></div>
                {/* Barbell */}
                <div className="absolute -left-8 top-2 w-20 h-2 bg-gray-700 rounded-full"></div>
                <div className="absolute -left-10 top-1 w-4 h-4 bg-gray-800 rounded-full"></div>
                <div className="absolute right-6 top-1 w-4 h-4 bg-gray-800 rounded-full"></div>
              </div>
              {/* Legs */}
              <div className="flex justify-center gap-1 mt-1">
                <div className="w-4 h-12 bg-blue-600 rounded-full"></div>
                <div className="w-4 h-12 bg-blue-600 rounded-full"></div>
              </div>
              {/* Feet */}
              <div className="flex justify-center gap-1 mt-1">
                <div className="w-6 h-3 bg-gray-800 rounded-full"></div>
                <div className="w-6 h-3 bg-gray-800 rounded-full"></div>
              </div>
            </motion.div>

            {/* Character 2 - Runner */}
            <motion.div
              className="relative ml-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              {/* Head */}
              <div className="w-14 h-14 bg-amber-100 rounded-full mb-1 mx-auto relative">
                <div className="w-2 h-2 bg-gray-800 rounded-full absolute top-4 left-3"></div>
                <div className="w-2 h-2 bg-gray-800 rounded-full absolute top-4 right-3"></div>
                <div className="w-3 h-1 bg-gray-700 rounded absolute top-8 left-1/2 transform -translate-x-1/2"></div>
                {/* Hair */}
                <div className="w-8 h-4 bg-gray-800 rounded-t-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
              </div>
              {/* Body */}
              <div className="w-10 h-16 bg-gray-600 mx-auto rounded-t-lg relative">
                {/* Running arms */}
                <div className="absolute -left-3 top-2 w-6 h-3 bg-amber-100 rounded-full transform -rotate-45"></div>
                <div className="absolute -right-3 top-6 w-6 h-3 bg-amber-100 rounded-full transform rotate-45"></div>
              </div>
              {/* Running legs */}
              <div className="flex justify-center gap-2 mt-1">
                <div className="w-3 h-10 bg-blue-700 rounded-full transform rotate-12"></div>
                <div className="w-3 h-10 bg-blue-700 rounded-full transform -rotate-12"></div>
              </div>
              {/* Running shoes */}
              <div className="flex justify-center gap-3 mt-1">
                <div className="w-5 h-2 bg-white border border-gray-400 rounded-full transform rotate-12"></div>
                <div className="w-5 h-2 bg-white border border-gray-400 rounded-full transform -rotate-12"></div>
              </div>
            </motion.div>

            {/* Connecting line/rope */}
            <motion.div
              className="absolute top-16 left-1/2 transform -translate-x-1/2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
            >
              <svg width="60" height="40" className="text-red-400">
                <path
                  d="M10,20 Q30,5 50,20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                />
              </svg>
            </motion.div>
          </div>

          {/* Alpha Fitness Logo */}
          <motion.div
            className="absolute bottom-4 right-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <Image
              src="/ALPHAFIT.LOGO.png"
              alt="Alpha Fitness Logo"
              width={64}
              height={64}
              className="object-contain opacity-50"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

//  <Image
//               src="/ALPHAFIT.LOGO.png"
//               height={500}
//               width={500}
//               alt="Alpha Fitness Logo"
//               className="w-16 h-16 object-contain opacity-50"
//             />