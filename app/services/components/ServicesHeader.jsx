import React from 'react'
import AlphaFitness from '@/components/Alphafitness'
import { motion } from "framer-motion"

export default function ServicesHeader() {
  return (
    <header className='relative h-auto w-full flex flex-col bg-gradient-to-br from-[#D9D9D9] via-[#E8E8E8] to-[#F5F5F5] p-4 sm:p-6 lg:p-8 justify-center items-center overflow-hidden'>
      
      {/* Static background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 lg:w-48 lg:h-48 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 lg:w-36 lg:h-36 bg-purple-400 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 lg:w-56 lg:h-56 bg-indigo-300 rounded-full blur-3xl"></div>
      </div>
      
      {/* Static geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 right-16 w-4 h-4 bg-blue-500 rotate-45 opacity-20"></div>
        <div className="absolute bottom-32 left-20 w-6 h-6 bg-purple-500 rounded-full opacity-30"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-8 bg-indigo-400 opacity-25"></div>
      </div>

      <div className='flex flex-col gap-6 sm:gap-8 items-center p-6 sm:p-8 lg:p-10 relative z-10'>
        
        <motion.div
          className="flex items-center gap-3 sm:gap-4"
          initial = {{opacity: 0, x:-100}}
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className='flex gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-russo items-center'>
            <AlphaFitness/>
            <h1>Services</h1>
          </div>
        </motion.div>

        <motion.div
          className="text-center max-w-xs sm:max-w-md lg:max-w-2xl lg:text-center lg:text-[20px] font-bold font-arone opacity-70"
          initial = {{opacity: 0, x:100}}
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <p className="text-base leading-relaxed max-w-prose text-center opacity-70 ">
            Start with a keycard, then choose from our premium fitness services including gym access, group classes, and personal training.
          </p>
        </motion.div>


      </div>
      
      {/* Bottom subtle overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 bg-gradient-to-t from-white/30 to-transparent"></div>
    </header>
  )
}