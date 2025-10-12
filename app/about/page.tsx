'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaBullseye, FaTasks, FaClipboardList, FaWhatsapp } from 'react-icons/fa'

export default function AboutPage() {
  const cards = [
    { icon: <FaBullseye size={28} className="text-blue-500" />, title: 'Visi', desc: 'Menyediakan sistem rekam medis digital yang modern dan efisien.' },
    { icon: <FaTasks size={28} className="text-purple-500" />, title: 'Misi', desc: 'Meningkatkan akurasi dan kemudahan pengelolaan data pasien.' },
    { icon: <FaClipboardList size={28} className="text-green-500" />, title: 'Fitur', desc: 'Rekam medis, data pasien, laporan, dan sistem notifikasi interaktif.' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      
      {/* Navbar atas */}
      <footer className="bg-gray-100 p-6 w-full">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-700 gap-4">
          <div className="flex gap-4 items-center">
            <Link href="/" className="hover:text-black transition">Home</Link>
            <Link href="/login" className="hover:text-black transition">Login</Link>
            <Link href="/registrasi" className="hover:text-black transition">Registrasi</Link>
          </div>

          <a
            href="https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20menghubungi%20RME%20Project"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-green-600 font-semibold hover:text-green-800 transition"
          >
            <FaWhatsapp /> Hubungi Kami
          </a>
        </div>
      </footer>

      <main className="flex-1 p-8 flex flex-col items-center">
        <motion.h1
          className="text-5xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Tentang Proyek RME
        </motion.h1>

        <motion.p
          className="text-gray-700 max-w-2xl text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Proyek RME dibuat untuk memudahkan manajemen data pasien, memantau rekam medis, dan meningkatkan efisiensi rumah sakit atau klinik.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, boxShadow: '0 25px 35px rgba(0,0,0,0.15)' }}
              className="flex flex-col items-center text-center bg-gray-50 p-6 rounded-xl shadow-lg cursor-pointer border-2 border-transparent hover:border-gradient-to-r hover:from-blue-500 hover:to-purple-500 mb-4"
            >
              <div className="mb-4">{card.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
              <p className="text-gray-700">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
