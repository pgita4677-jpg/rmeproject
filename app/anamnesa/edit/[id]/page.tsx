"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Pasien {
  no_rm: string;
  nama: string;
  alamat?: string;
  usia?: string;
  jenis_kelamin?: string;
  tanggal_lahir?: string;
  no_hp?: string;
}

interface Resep {
  nama_obat: string;
  dosis: string;
  aturan: string;
}

interface Anamnesa {
  id: number;
  keluhan: string;
  riwayat: string;
  tensi: string;
  hasil_lab: string;
  created_at: string;
  resep?: Resep[];
}

export default function RekamMedisPage() {
  const { no_rm } = useParams();
  const router = useRouter();

  const [pasien, setPasien] = useState<Pasien | null>(null);
  const [formData, setFormData] = useState<Pasien | null>(null);
  const [anamnesaList, setAnamnesaList] = useState<Anamnesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Ambil data pasien & anamnesa
  useEffect(() => {
    if (!no_rm) return;

    const fetchData = async () => {
      try {
        const resPasien = await fetch(`/api/pasien/${no_rm}`);
        const pasienData = await resPasien.json();

        const resAnamnesa = await fetch(`/api/anamnesa?no_rm=${no_rm}`);
        const anamnesaData = await resAnamnesa.json();

        const pasienItem = pasienData.data || pasienData || null;
        setPasien(pasienItem);
        setFormData(pasienItem);

        const anamnesaArr = anamnesaData.data || [];
        setAnamnesaList(anamnesaArr);
      } catch (err) {
        console.error("❌ Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [no_rm]);

  // 🔹 Simpan update pasien
  const handleSavePasien = async () => {
    if (!formData) return;
    try {
      const res = await fetch(`/api/pasien/${formData.no_rm}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui data pasien");

      setPasien(formData);
      setIsEditing(false);
      alert("✅ Data pasien berhasil diperbarui!");
    } catch (err: any) {
      alert("❌ Terjadi kesalahan saat menyimpan data pasien: " + err.message);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">⏳ Memuat data...</p>;
  if (!pasien)
    return <p className="text-center mt-10 text-red-500 font-semibold">❌ Data pasien tidak ditemukan.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">🩺 Rekam Medis {pasien.nama}</h1>
      </div>

      {/* 🧾 Data Pasien */}
      <div className="bg-gray-50 p-5 rounded-lg border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">🧾 Data Pasien</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              ✏️ Edit
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleSavePasien}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                💾 Simpan
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(pasien);
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
              >
                ❌ Batal
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-2">
          {[
            { label: "No. RM", key: "no_rm" },
            { label: "Nama", key: "nama" },
            { label: "Tanggal Lahir", key: "tanggal_lahir" },
            { label: "Usia", key: "usia" },
            { label: "Jenis Kelamin", key: "jenis_kelamin" },
            { label: "No. HP", key: "no_hp" },
            { label: "Alamat", key: "alamat", colSpan: 2 },
          ].map((field) => (
            <div key={field.key} className={field.colSpan ? "col-span-2" : ""}>
              <p className="font-semibold text-gray-700">{field.label}:</p>
              {isEditing ? (
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full"
                  value={(formData as any)?.[field.key] || ""}
                  onChange={(e) => setFormData({ ...formData!, [field.key]: e.target.value })}
                />
              ) : (
                <p>{(pasien as any)?.[field.key] || "-"}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Riwayat Kunjungan */}
      <div className="bg-white border rounded-lg p-4 shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">📋 Riwayat Kunjungan</h2>
          <button
            onClick={() => router.push(`/anamnesa/${pasien.no_rm}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium"
          >
            + Tambah Kunjungan
          </button>
        </div>

        {anamnesaList.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada data kunjungan.</p>
        ) : (
          anamnesaList.map((a, index) => (
            <div key={a.id} className="border rounded-lg p-3 mb-3 hover:bg-gray-50 transition">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">🔹 Kunjungan {index + 1}</h3>
                <button
                  onClick={() => router.push(`/anamnesa/edit?id=${a.id}`)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  ✏️ Edit
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-2">{new Date(a.created_at).toLocaleDateString("id-ID")}</p>
              <p><strong>Keluhan:</strong> {a.keluhan}</p>
              <p><strong>Riwayat:</strong> {a.riwayat}</p>
              <p><strong>Tensi:</strong> {a.tensi}</p>
              <p><strong>Hasil Lab:</strong> {a.hasil_lab}</p>
            </div>
          ))
        )}
      </div>

      {/* 🔙 Tombol kembali */}
      <div className="text-right">
        <button
          onClick={() => router.push("/pasien")}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium"
        >
          ← Kembali ke Daftar Pasien
        </button>
      </div>
    </div>
  );
}
