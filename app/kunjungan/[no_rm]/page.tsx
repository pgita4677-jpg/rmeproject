"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function KunjunganPage({ params }: { params: { no_rm: string } }) {
  const router = useRouter();
  const { no_rm } = params;

  const [formData, setFormData] = useState({
    keluhan: "",
    riwayat: "",
    tensi: "",
    hasil_lab: "",
    nama_obat: "",
    dosis: "",
    aturan: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/kunjungan/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no_rm, ...formData }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Kunjungan berhasil disimpan!");
        router.push(`/rekam-medis/${no_rm}`);
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("🔥 Error simpan kunjungan:", err);
      alert("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🩺 Tambah Kunjungan Pasien
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="no_rm" value={no_rm} />

          <div>
            <label className="font-semibold text-gray-700">Keluhan</label>
            <textarea name="keluhan" value={formData.keluhan} onChange={handleChange}
              className="w-full border p-2 rounded-lg" required />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Riwayat</label>
            <textarea name="riwayat" value={formData.riwayat} onChange={handleChange}
              className="w-full border p-2 rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700">Tensi</label>
              <input type="text" name="tensi" value={formData.tensi} onChange={handleChange}
                className="w-full border p-2 rounded-lg" />
            </div>
            <div>
              <label className="font-semibold text-gray-700">Hasil Lab</label>
              <input type="text" name="hasil_lab" value={formData.hasil_lab} onChange={handleChange}
                className="w-full border p-2 rounded-lg" />
            </div>
          </div>

          <h2 className="text-lg font-bold mt-6">💊 Resep Obat</h2>
          <div className="grid grid-cols-3 gap-4">
            <input type="text" name="nama_obat" placeholder="Nama Obat"
              value={formData.nama_obat} onChange={handleChange} className="border p-2 rounded-lg" />
            <input type="text" name="dosis" placeholder="Dosis"
              value={formData.dosis} onChange={handleChange} className="border p-2 rounded-lg" />
            <input type="text" name="aturan" placeholder="Aturan Pakai"
              value={formData.aturan} onChange={handleChange} className="border p-2 rounded-lg" />
          </div>

          <div className="flex justify-between mt-8">
            <button type="button"
              onClick={() => router.push(`/rekam-medis/${no_rm}`)}
              className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition">
              Kembali
            </button>

            <button type="submit" disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? "Menyimpan..." : "Simpan Kunjungan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
