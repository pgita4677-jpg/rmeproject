"use client";
import React from "react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Dashboard RME
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/pasien" className="bg-white p-6 rounded-xl shadow hover:bg-blue-50 transition">
          <h2 className="text-xl font-semibold text-gray-800">📋 Registrasi Pasien</h2>
          <p className="text-gray-600 mt-2">Pasien Baru dan Pasien Lama</p>
        </Link>

        <Link href="/rekam-medis" className="bg-white p-6 rounded-xl shadow hover:bg-blue-50 transition">
          <h2 className="text-xl font-semibold text-gray-800">🩺 Rekam Medis</h2>
          <p className="text-gray-600 mt-2">Riwayat Rekam Medis</p>
        </Link>

        <Link href="/farmasi" className="bg-white p-6 rounded-xl shadow hover:bg-blue-50 transition">
          <h2 className="text-xl font-semibold text-gray-800">📋 Farmasi</h2>
          <p className="text-gray-600 mt-2">Resep Obat Pasien</p>
        </Link>

        <Link href="/laporan" className="bg-white p-6 rounded-xl shadow hover:bg-blue-50 transition">
          <h2 className="text-xl font-semibold text-gray-800">📊 Laporan</h2>
          <p className="text-gray-600 mt-2">Cetak atau ekspor laporan pasien</p>
        </Link>
      </div>
    </div>
  );
}
