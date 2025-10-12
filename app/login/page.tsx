'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter() // untuk redirect

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // trim dan lowercase untuk case-insensitive
    const user = username.trim().toLowerCase()
    const pass = password.trim()

    if (user === 'admin' && pass === '12345') {
      alert('Login berhasil!')
      router.push('/dashboard') // redirect ke AboutPage
    } else {
      alert('Username atau password salah!')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">

      {/* Navbar atas */}
      <footer className="bg-gray-100 p-6 w-full">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center text-gray-700 gap-4">
          <div className="flex gap-4 items-center">
            <Link href="/" className="hover:text-black transition">Home</Link>
            <Link href="/about" className="hover:text-black transition">About</Link>
            <Link href="/registrasi" className="hover:text-black transition">Registrasi</Link>

            <a
              href="https://wa.me/6282219886907?text=Halo,%20saya%20ingin%20menghubungi%20RME%20Project"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-green-600 font-semibold hover:text-green-800 transition"
            >
              <FaWhatsapp /> Hubungi Kami
            </a>
          </div>
        </div>
      </footer>

      {/* Konten Login */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-md p-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-black">Login</h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white font-semibold py-3 rounded-lg mt-2 hover:bg-blue-600 transition"
            >
              Login
            </motion.button>
          </form>

          <p className="mt-4 text-center text-gray-700">
            Belum punya akun?{' '}
            <Link href="/registrasi" className="text-blue-500 font-semibold hover:underline">
              Registrasi
            </Link>
          </p>
        </motion.div>
      </main>

      {/* Footer bawah clean */}
      <footer className="bg-gray-100 p-6 w-full mt-auto">
        <div className="max-w-6xl mx-auto text-center text-gray-700">
          © 2025 RME Project. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
