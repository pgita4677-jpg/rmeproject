"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { UserPlus, Users } from "lucide-react";

export default function PilihPasienPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center border border-blue-100"
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-3">
          Pilih Jenis Pasien
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          Silakan pilih apakah pasien merupakan pasien baru atau pasien lama.
        </p>

        {/* Tombol Pasien Baru */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/pasien/add")}
          className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white py-3 rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300 mb-4"
        >
          <UserPlus className="w-5 h-5" />
          <span className="font-semibold">Pasien Baru</span>
        </motion.button>

        {/* Tombol Pasien Lama */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/pasien/select")}
          className="w-full flex items-center justify-center space-x-3 bg-green-600 text-white py-3 rounded-xl shadow-md hover:bg-green-700 transition-all duration-300"
        >
          <Users className="w-5 h-5" />
          <span className="font-semibold">Pasien Lama</span>
        </motion.button>

        <div className="mt-8 text-gray-400 text-xs">
          © {new Date().getFullYear()} Sistem Rekam Medis Elektronik
        </div>
      </motion.div>
    </div>
  );
}
