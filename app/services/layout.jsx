'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import ServicesHeader from './components/ServicesHeader'
import ServicesTabs from './components/ServicesTabs'
import ServicesFooter from './components/ServicesFooter'

export default function ServicesLayout({ children }) {
  const pathname = usePathname()

  return (
    <div>
      <ServicesHeader />
      <ServicesTabs />

      {/* Smooth page transition */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="mt-4"
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <ServicesFooter/>
    </div>
  )
}
