'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

import NavbarPublik from '../components/NavbarPublik'
import NavbarInternal from '../components/NavbarInternal'
import FooterPublik from '../components/FooterPublik'
import FooterInternal from '../components/FooterInternal'

import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // ✅ Tentukan jenis halaman berdasarkan path
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
    <html lang="id">
      <body className="bg-white text-gray-900 flex flex-col min-h-screen">
        {/* ✅ Navbar sesuai tipe halaman */}
        {isPublicPage && <NavbarPublik />}
        {isInternalPage && <NavbarInternal />}

        {/* ✅ Transisi antar halaman */}
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

        {/* ✅ Footer sesuai tipe halaman */}
        {isPublicPage && <FooterPublik />}
        {isInternalPage && <FooterInternal />}
      </body>
    </html>
  )
}
