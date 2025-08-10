import React from 'react'
import { Button } from '@/components/ui/button'
import AlphaFitness from '@/components/Alphafitness'

function InnerFooter() {
  return (
    <div className="w-full font-arone p-4 sm:p-5 text-xs sm:text-sm text-black text-center flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
      <AlphaFitness className="text-xl sm:text-2xl" />
      <span>© {new Date().getFullYear()} Alpha Fitness. All rights reserved.</span>
    </div>
  )
}

export default function ServicesFooter() {
  return (
    <>
      {/* Gradient background section */}
      <footer className="w-full px-6 sm:p-10 py-8 sm:py-10 flex flex-col bg-[linear-gradient(157deg,#0A0F1C_0%,#000000_50%,#111B2E_100%)]">
        <div className="space-y-6 sm:space-y-8">
          {/* Heading & paragraph */}
          <div className="flex flex-col gap-6 sm:gap-8 items-center">
            <h1 className="font-russo text-xl sm:text-3xl text-white text-center leading-snug">
              Ready to Start Your Fitness Journey?
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-white max-w-prose text-center">
              Contact us today to get your keycard and choose the perfect training program for you and personal training.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center">
            <Button variant={'secondary'} className="text-white w-full sm:w-auto">
              Contact Us
            </Button>
            <Button variant={'outlineSecondary'} className="text-secondary w-full sm:w-auto">
              Get Started Today!
            </Button>
          </div>
        </div>
      </footer>

      {/* Separate footer */}
      <InnerFooter />
    </>
  )
}
