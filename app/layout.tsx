'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <html lang="en">
      <body className="bg-white text-black flex flex-col min-h-screen">
        {/* Page Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="flex-1"
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="bg-gray-100 p-6 w-full mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center text-gray-700 gap-2 md:gap-4">
            
            {/* Copyright */}
            <span className="text-center md:text-left">
              © 2025 RME Project. All rights reserved.
            </span>

            

      
          </div>
        </footer>
      </body>
    </html>
  )
}
