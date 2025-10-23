'use client'

import { motion } from 'framer-motion'
import { FaBullseye, FaTasks, FaClipboardList, FaWhatsapp } from 'react-icons/fa'

export default function AboutPage() {
  const cards = [
    {
      icon: <FaBullseye size={28} className="text-blue-500" />,
      title: 'Visi',
      desc: 'Menyediakan sistem rekam medis digital yang modern dan efisien untuk kemajuan pelayanan kesehatan.',
    },
    {
      icon: <FaTasks size={28} className="text-purple-500" />,
      title: 'Misi',
      desc: 'Meningkatkan akurasi, transparansi, dan kemudahan pengelolaan data pasien di setiap fasilitas kesehatan.',
    },
    {
      icon: <FaClipboardList size={28} className="text-green-500" />,
      title: 'Fitur',
      desc: 'Rekam medis digital, data pasien, laporan otomatis, dan sistem notifikasi interaktif.',
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800">
      {/* 🔹 Hero Section */}
      <section className="flex flex-col items-center text-center mt-16 px-6">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Tentang Proyek RME
        </motion.h1>

        <motion.p
          className="max-w-3xl text-lg text-gray-600 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          RME (Rekam Medis Elektronik) Project hadir untuk membawa revolusi dalam manajemen data pasien —
          menghadirkan sistem yang cepat, aman, dan mudah diakses di era digital.
        </motion.p>
      </section>

      {/* 🔹 Cards Section */}
      <section className="flex-1 mt-16 px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white/70 backdrop-blur-md border border-gray-100 shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition"
            >
              <div className="mb-4">{card.icon}</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h2>
              <p className="text-gray-600">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 🔹 CTA Section */}
      <motion.section
        className="mt-24 mb-16 text-center px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          Siap beralih ke sistem rekam medis digital?
        </h3>
        <p className="text-gray-600 mb-6">
          Bergabunglah bersama kami dan rasakan kemudahan mengelola data pasien dengan efisien.
        </p>
        <a
          href="https://wa.me/6282219886907?text=Halo,%20saya%20ingin%20bergabung%20dengan%20RME%20Project"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold hover:opacity-90 transition"
        >
          🚀 Hubungi Sekarang
        </a>
      </motion.section>
    </div>
  )
}
