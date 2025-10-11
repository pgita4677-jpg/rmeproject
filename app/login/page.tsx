"use client"; // wajib supaya useState bisa jalan di Next.js
import React, { useState } from "react";

export default function LoginPage() {
  // ✅ State untuk menyimpan input username dan password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Fungsi handleSubmit — disimpan di dalam komponen
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // mencegah reload halaman

    // validasi sederhana
    if (username === "admin" && password === "12345") {
      alert("Login berhasil!");
      window.location.href = "/dashboard"; // pindah ke halaman dashboard
    } else {
      alert("Username atau password salah!");
    }
  };

  // ✅ Tampilan form login
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Login RME
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Masukkan username"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Masukkan password"
              required
            />
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{" "}
          <a href="/registrasi" className="text-blue-500 hover:underline">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
