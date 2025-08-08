import React from 'react'
import { Button } from '@/components/ui/button'
import AlphaFitness from '@/components/Alphafitness'

function InnerFooter() {
  return (
    <div className="w-full font-arone p-5 text-sm text-black text-center flex justify-between items-center">
        <AlphaFitness className='text-2xl'/>
      © {new Date().getFullYear()} Alpha Fitness. All rights reserved.
    </div>
  )
}

export default function ServicesFooter() {
  return (
    <>
      {/* This is the gradient background section */}
      <footer className='w-full p-10 h-auto flex flex-col bg-[linear-gradient(157deg,#0A0F1C_0%,#000000_50%,#111B2E_100%)]'> 
        <div className='space-y-8'>
          <div className='flex flex-col gap-8 items-center'>
            <h1 className='font-russo text-3xl text-white'>Ready to Start Your Fitness Journey?</h1>
            <p className="text-base leading-relaxed text-white max-w-prose text-center">
              Contact us today to get your keycard and choose the perfect training program for you. and personal training.
            </p>
          </div>

          <div className='flex gap-5 justify-center items-center'>
            <Button variant={'secondary'} className={'text-white'}>Contact Us</Button>
            <Button variant={'outlineSecondary'} className={'text-secondary'}>Get Started Today!</Button>
          </div>
        </div>
      </footer>

      {/* ✅ Separate footer with different background */}
      <InnerFooter />
    </>
  )
}
