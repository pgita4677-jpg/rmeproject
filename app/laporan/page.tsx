"use client";

import { useState, useEffect } from "react";

export default function LaporanPage() {
  const [data, setData] = useState<any[]>([]);
  const [statistik, setStatistik] = useState<any>({});
  const [dari, setDari] = useState("");
  const [sampai, setSampai] = useState("");
  const [loading, setLoading] = useState(false);

  async function getLaporan() {
    try {
      setLoading(true);
      const url = new URL("/api/laporan", window.location.origin);
      if (dari && sampai) {
        url.searchParams.set("dari", dari);
        url.searchParams.set("sampai", sampai);
      }
      const res = await fetch(url.toString());
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setStatistik(json.statistik);
      } else {
        console.error("Gagal ambil data:", json.message);
      }
    } catch (err) {
      console.error("❌ Error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getLaporan();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Laporan Rekam Medis</h1>

      {/* 🔹 Filter */}
      <div className="flex items-center gap-3 mb-6">
        <div>
          <label className="block text-sm font-semibold">Dari Tanggal</label>
          <input
            type="date"
            className="border p-2 rounded-md"
            value={dari}
            onChange={(e) => setDari(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Sampai Tanggal</label>
          <input
            type="date"
            className="border p-2 rounded-md"
            value={sampai}
            onChange={(e) => setSampai(e.target.value)}
          />
        </div>
        <button
          onClick={getLaporan}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Memuat..." : "🔍 Tampilkan"}
        </button>
      </div>

      {/* 🔹 Statistik Ringkasan */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-blue-50 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Pasien</p>
          <h2 className="text-xl font-bold text-blue-700">
            {statistik?.totalPasien || 0}
          </h2>
        </div>
        <div className="p-4 bg-green-50 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Kunjungan</p>
          <h2 className="text-xl font-bold text-green-700">
            {statistik?.totalKunjungan || 0}
          </h2>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg shadow">
          <p className="text-sm text-gray-600">Pasien Baru</p>
          <h2 className="text-xl font-bold text-purple-700">
            {statistik?.totalPasienBaru || 0}
          </h2>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg shadow">
          <p className="text-sm text-gray-600">Kunjungan Ulang</p>
          <h2 className="text-xl font-bold text-yellow-700">
            {statistik?.totalKunjunganUlang || 0}
          </h2>
        </div>
        <div className="p-4 bg-pink-50 rounded-lg shadow col-span-2 md:col-span-1">
          <p className="text-sm text-gray-600">Keluhan Tersering</p>
          <h2 className="text-lg font-semibold text-pink-700">
            {statistik?.keluhanTersering || "-"}
          </h2>
        </div>
        <div className="p-4 bg-red-50 rounded-lg shadow col-span-2 md:col-span-1">
          <p className="text-sm text-gray-600">Obat Tersering</p>
          <h2 className="text-lg font-semibold text-red-700">
            {statistik?.obatTersering || "-"}
          </h2>
        </div>
      </div>

      {/* 🔹 Tabel Laporan */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">No RM</th>
              <th className="border px-3 py-2">Nama Pasien</th>
              <th className="border px-3 py-2">Keluhan</th>
              <th className="border px-3 py-2">Tanggal</th>
              <th className="border px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            )}
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{row.no_rm}</td>
                <td className="border px-3 py-2">{row.nama_pasien}</td>
                <td className="border px-3 py-2">{row.keluhan || "-"}</td>
                <td className="border px-3 py-2">
                  {new Date(row.tanggal).toLocaleDateString("id-ID")}
                </td>
                <td
                  className={`border px-3 py-2 font-medium ${
                    row.status_pasien === "Pasien Baru"
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
                >
                  {row.status_pasien}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
