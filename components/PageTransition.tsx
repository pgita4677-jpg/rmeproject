'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import NavbarPublik from './NavbarPublik'
import NavbarInternal from './NavbarInternal'
import FooterPublik from './FooterPublik'
import FooterInternal from './FooterInternal'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isPublicPage =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register')

  const isInternalPage =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/pasien') ||
    pathname.startsWith('/rekam-medis') ||
    pathname.startsWith('/farmasi') ||
    pathname.startsWith('/laporan')

  return (
    <>
      {/* Navbar */}
      {isPublicPage && <NavbarPublik />}
      {isInternalPage && <NavbarInternal />}

      {/* Transisi halaman */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="flex-1"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      {isPublicPage && <FooterPublik />}
      {isInternalPage && <FooterInternal />}
    </>
  )
}
