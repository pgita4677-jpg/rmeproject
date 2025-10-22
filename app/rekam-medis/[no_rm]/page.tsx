"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

  // 🔹 state untuk modal tambah kunjungan
  const [showModal, setShowModal] = useState(false);
  const [newKunjungan, setNewKunjungan] = useState({
    keluhan: "",
    riwayat: "",
    tensi: "",
    hasil_lab: "",
  });

  // 🔹 list resep obat yang akan dikirimkan ke backend
  const [resepList, setResepList] = useState<Resep[]>([
    { nama_obat: "", dosis: "", aturan: "" },
  ]);

  const handleAddResep = () => {
    setResepList([...resepList, { nama_obat: "", dosis: "", aturan: "" }]);
  };

  const handleChangeResep = (index: number, field: keyof Resep, value: string) => {
    const newList = [...resepList];
    newList[index][field] = value;
    setResepList(newList);
  };

  const handleRemoveResep = (index: number) => {
    const updated = resepList.filter((_, i) => i !== index);
    setResepList(updated);
  };

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
      // pastikan tanggal_lahir dikirim dalam format YYYY-MM-DD
      const formattedData = {
        ...formData,
        tanggal_lahir: formData.tanggal_lahir
          ? formData.tanggal_lahir.split("T")[0] // ambil hanya tanggal tanpa waktu
          : null,
      };

      const res = await fetch(`/api/pasien/${formData.no_rm}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui data pasien");

      setPasien(formData);
      setIsEditing(false);
      alert("✅ Data pasien berhasil diperbarui!");
    } catch (err: any) {
      alert("❌ Terjadi kesalahan saat menyimpan data pasien: " + err.message);
      console.error("🔥 Error update pasien:", err);
    }
  };

  // 🔹 Hapus kunjungan (anamnesa)
  const handleDeleteKunjungan = async (id: number) => {
    const konfirmasi = confirm("Apakah kamu yakin ingin menghapus kunjungan ini?");
    if (!konfirmasi) return;

    try {
      const res = await fetch(`/api/anamnesa/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal menghapus kunjungan");

      setAnamnesaList((prev) => prev.filter((a) => a.id !== id));
      alert("🗑️ Kunjungan berhasil dihapus!");
    } catch (err: any) {
      alert("❌ Terjadi kesalahan: " + err.message);
    }
  };

  // 🔹 Tambah kunjungan baru + resep tersimpan otomatis
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
            (r) => r.nama_obat.trim() !== "" && r.dosis.trim() !== "" && r.aturan.trim() !== ""
          ),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menambah kunjungan");

      setAnamnesaList((prev) => [data.data || data, ...prev]);
      setNewKunjungan({ keluhan: "", riwayat: "", tensi: "", hasil_lab: "" });
      setResepList([{ nama_obat: "", dosis: "", aturan: "" }]);
      setShowModal(false);
      alert("✅ Kunjungan & resep berhasil ditambahkan!");
    } catch (err: any) {
      alert("❌ Terjadi kesalahan: " + err.message);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">⏳ Memuat data...</p>;

  if (!pasien)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">
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
                  onChange={(e) =>
                    setFormData({ ...formData!, [field.key]: e.target.value })
                  }
                />
              ) : (
                <p>{(pasien as any)?.[field.key] || "-"}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Riwayat Kunjungan */}
      <div className="bg-white border rounded-lg p-4 shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">
            📋 Riwayat Kunjungan
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium"
          >
            + Tambah Kunjungan
          </button>
        </div>

        {anamnesaList.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada data kunjungan.</p>
        ) : (
          anamnesaList.map((a, index) => (
            <div
              key={a.id}
              className="border rounded-lg p-3 mb-3 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">
                  🔹 Kunjungan {index + 1}
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
              <p><strong>Keluhan:</strong> {a.keluhan}</p>
              <p><strong>Riwayat:</strong> {a.riwayat}</p>
              <p><strong>Tensi:</strong> {a.tensi}</p>
              <p><strong>Hasil Lab:</strong> {a.hasil_lab}</p>

              {a.resep && a.resep.length > 0 && (
                <div className="mt-3 border-t pt-2 bg-gray-50 rounded-lg p-2">
                  <h4 className="font-semibold text-gray-700 mb-1">💊 Resep Obat:</h4>
                  <ul className="list-disc pl-6 text-sm text-gray-700">
                    {a.resep.map((r, i) => (
                      <li key={i}>
                        <strong>{r.nama_obat}</strong> — {r.dosis} — {r.aturan}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}

        <div className="text-right mt-4">
          <button
            onClick={() => router.push("/pasien")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium"
          >
            ← Kembali ke Daftar Pasien
          </button>
        </div>
      </div>

      {/* Modal Tambah Kunjungan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <form
            onSubmit={handleTambahKunjungan}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              + Tambah Kunjungan
            </h3>

            {["keluhan", "riwayat", "tensi", "hasil_lab"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {field.replace("_", " ")}
                </label>
                <input
                  type="text"
                  value={(newKunjungan as any)[field]}
                  onChange={(e) =>
                    setNewKunjungan({ ...newKunjungan, [field]: e.target.value })
                  }
                  className="border rounded-lg w-full p-2 text-sm"
                  required
                />
              </div>
            ))}

            {/* Input Resep */}
            <div className="border-t pt-3">
              <h4 className="font-semibold text-gray-800 mb-2">💊 Resep Obat</h4>
              {resepList.map((r, index) => (
                <div key={index} className="border rounded-lg p-2 mb-2 relative">
                  <input
                    type="text"
                    placeholder="Nama Obat"
                    value={r.nama_obat}
                    onChange={(e) =>
                      handleChangeResep(index, "nama_obat", e.target.value)
                    }
                    className="border rounded p-1 w-full mb-1 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Dosis"
                    value={r.dosis}
                    onChange={(e) =>
                      handleChangeResep(index, "dosis", e.target.value)
                    }
                    className="border rounded p-1 w-full mb-1 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Aturan Pakai"
                    value={r.aturan}
                    onChange={(e) =>
                      handleChangeResep(index, "aturan", e.target.value)
                    }
                    className="border rounded p-1 w-full text-sm"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveResep(index)}
                      className="absolute top-1 right-1 text-xs text-red-600"
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddResep}
                className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200"
              >
                + Tambah Obat
              </button>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
