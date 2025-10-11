"use client";

import React, { useState } from "react";

export default function Registrasi() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== konfirmasiPassword) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    alert(`Registrasi berhasil!\nNama: ${nama}\nEmail: ${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Registrasi Akun
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nama */}
          <div>
            <label htmlFor="nama" className="block text-gray-700 font-medium mb-1">
              Nama Lengkap
            </label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Masukkan email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-black-700 font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Masukkan password"
              required
            />
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label
              htmlFor="konfirmasiPassword"
              className="block text-gray-700 font-medium mb-1"
            >
              Konfirmasi Password
            </label>
            <input
              id="konfirmasiPassword"
              type="password"
              value={konfirmasiPassword}
              onChange={(e) => setKonfirmasiPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ulangi password"
              required
            />
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
          >
            Daftar
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login di sini
          </a>
        </p>
      </div>
    </div>
  );
}