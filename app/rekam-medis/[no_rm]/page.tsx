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
  id?: number;
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
  const { no_rm } = useParams() as { no_rm: string };
  const router = useRouter();

  const [pasien, setPasien] = useState<Pasien | null>(null);
  const [formData, setFormData] = useState<Pasien | null>(null);
  const [anamnesaList, setAnamnesaList] = useState<Anamnesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Modal kunjungan baru
  const [showModal, setShowModal] = useState(false);
  const [newKunjungan, setNewKunjungan] = useState({
    keluhan: "",
    riwayat: "",
    tensi: "",
    hasil_lab: "",
  });

  // Input resep
  const [resepList, setResepList] = useState<Resep[]>([
    { nama_obat: "", dosis: "", aturan: "" },
  ]);

  const handleAddResep = () =>
    setResepList([...resepList, { nama_obat: "", dosis: "", aturan: "" }]);

  const handleChangeResep = (
    index: number,
    field: keyof Resep,
    value: string
  ) => {
    const updated = [...resepList];
    updated[index][field] = value;
    setResepList(updated);
  };

  const handleRemoveResep = (index: number) =>
    setResepList(resepList.filter((_, i) => i !== index));

  // ✅ Ambil data pasien, anamnesa, dan resep dari API
  useEffect(() => {
    if (!no_rm) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/rekam-medis/${no_rm}`);
        const data = await res.json();

        if (!res.ok || !data.success)
          throw new Error(data.message || "Gagal memuat data");

        setPasien(data.data.pasien);
        setFormData(data.data.pasien);

        // Gabungkan anamnesa dan resep per kunjungan
        const anamnesa = data.data.anamnesa || [];
        const resep = data.data.resep || [];

        const merged = anamnesa.map((a: Anamnesa) => ({
          ...a,
          resep: resep.filter((r: Resep) => (r as any).anamnesa_id === a.id),
        }));

        setAnamnesaList(merged);
      } catch (err) {
        console.error("❌ Error fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [no_rm]);

  const handleSavePasien = async () => {
    if (!formData) return;
    try {
      const res = await fetch(`/api/pasien/${formData.no_rm}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("✅ Data pasien berhasil diperbarui!");
      setIsEditing(false);
    } catch (err: any) {
      alert("❌ Gagal menyimpan data pasien: " + err.message);
    }
  };

  const handleDeleteKunjungan = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kunjungan ini?")) return;
    try {
      const res = await fetch(`/api/anamnesa/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus kunjungan");
      setAnamnesaList((prev) => prev.filter((a) => a.id !== id));
      alert("🗑️ Kunjungan berhasil dihapus!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleTambahKunjungan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/anamnesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          no_rm,
          ...newKunjungan,
          resep: resepList.filter(
            (r) => r.nama_obat && r.dosis && r.aturan
          ),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAnamnesaList([data.data, ...anamnesaList]);
      setShowModal(false);
      alert("✅ Kunjungan berhasil ditambahkan!");
    } catch (err: any) {
      alert("❌ Gagal menambah kunjungan: " + err.message);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">⏳ Memuat data...</p>;

  if (!pasien)
    return (
      <p className="text-center mt-10 text-red-500">
        ❌ Data pasien tidak ditemukan.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          🩺 Rekam Medis {pasien.nama}
        </h1>
      </div>

      {/* Data Pasien */}
      <div className="bg-gray-50 p-5 rounded-lg border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">🧾 Data Pasien</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              ✏️ Edit
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleSavePasien}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                💾 Simpan
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(pasien);
                }}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                ❌ Batal
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            ["No. RM", "no_rm"],
            ["Nama", "nama"],
            ["Tanggal Lahir", "tanggal_lahir"],
            ["Usia", "usia"],
            ["Jenis Kelamin", "jenis_kelamin"],
            ["No. HP", "no_hp"],
            ["Alamat", "alamat"],
          ].map(([label, key]) => (
            <div key={key}>
              <p className="font-semibold">{label}</p>
              {isEditing ? (
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full"
                  value={(formData as any)?.[key] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData!, [key]: e.target.value })
                  }
                />
              ) : (
                <p>{(pasien as any)?.[key] || "-"}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Riwayat Kunjungan */}
      <div className="bg-white border rounded-lg p-4 shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">📋 Riwayat Kunjungan</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            + Tambah Kunjungan
          </button>
        </div>

        {anamnesaList.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada data kunjungan.</p>
        ) : (
          anamnesaList.map((a, i) => (
            <div
              key={a.id}
              className="border rounded-lg p-3 mb-3 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">
                  🔹 Kunjungan {i + 1}
                </h3>
                <div className="space-x-2">
                  <button
                    onClick={() => router.push(`/anamnesa/edit?id=${a.id}`)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteKunjungan(a.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-2">
                {new Date(a.created_at).toLocaleDateString("id-ID")}
              </p>
              <p><b>Keluhan:</b> {a.keluhan}</p>
              <p><b>Riwayat:</b> {a.riwayat}</p>
              <p><b>Tensi:</b> {a.tensi}</p>
              <p><b>Hasil Lab:</b> {a.hasil_lab}</p>

              {a.resep && a.resep.length > 0 && (
                <div className="mt-3 border-t pt-2 bg-gray-50 rounded-lg p-2">
                  <h4 className="font-semibold mb-1">💊 Resep Obat:</h4>
                  <ul className="list-disc pl-5 text-sm">
                    {a.resep.map((r, j) => (
                      <li key={j}>
                        <b>{r.nama_obat}</b> — {r.dosis} — {r.aturan}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
