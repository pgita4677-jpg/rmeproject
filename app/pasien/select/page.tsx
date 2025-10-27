"use client";

import { useEffect, useState } from "react";

interface Pasien {
  no_rm: string;
  nama: string;
  alamat: string;
}

interface Anamnesa {
  keluhan: string;
  riwayat: string;
  tensi: string;
  hasil_lab: string;
}

interface Resep {
  nama_obat: string;
  dosis: string;
  aturan: string;
}

export default function PasienSelectPage() {
  const [dataPasien, setDataPasien] = useState<Pasien[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState<Anamnesa>({
    keluhan: "",
    riwayat: "",
    tensi: "",
    hasil_lab: "",
  });
  const [resepList, setResepList] = useState<Resep[]>([
    { nama_obat: "", dosis: "", aturan: "" },
  ]);

  // 🔹 Ambil daftar pasien dari API
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("/api/pasien/select");
        const result = await res.json();

        console.log("🔍 Hasil Fetch Pasien:", result);

        if (Array.isArray(result)) {
          setDataPasien(result);
        } else if (result.data && Array.isArray(result.data)) {
          setDataPasien(result.data);
        } else {
          console.error("⚠️ Format data tidak dikenali:", result);
          setDataPasien([]);
        }
      } catch (err) {
        console.error("❌ Gagal ambil data pasien:", err);
        setDataPasien([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 🔹 Fungsi Modal
  const handleTambahKunjungan = (pasien: Pasien) => {
    setSelectedPasien(pasien);
    setShowModal(true);
  };

  const handleTambahObat = () => {
    setResepList([...resepList, { nama_obat: "", dosis: "", aturan: "" }]);
  };

  const handleHapusObat = (index: number) => {
    const newList = [...resepList];
    newList.splice(index, 1);
    setResepList(newList);
  };

  const handleChangeObat = (index: number, field: keyof Resep, value: string) => {
    const newList = [...resepList];
    newList[index][field] = value;
    setResepList(newList);
  };

  // 🔹 Submit Anamnesa + Resep
  const handleSubmit = async () => {
    if (!selectedPasien) return alert("Pilih pasien terlebih dahulu!");
    if (!form.keluhan.trim() || !form.tensi.trim())
      return alert("Keluhan dan Tensi wajib diisi!");

    try {
      const res = await fetch("/api/anamnesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          no_rm: selectedPasien.no_rm,
          ...form,
          resep: resepList,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("✅ Kunjungan baru & resep berhasil disimpan!");
        setShowModal(false);
        setForm({
          keluhan: "",
          riwayat: "",
          tensi: "",
          hasil_lab: "",
        });
        setResepList([{ nama_obat: "", dosis: "", aturan: "" }]);
        window.location.href = `/rekam-medis/${selectedPasien.no_rm}`;
      } else {
        alert("❌ Gagal menambah kunjungan: " + result.message);
      }
    } catch (err) {
      alert("❌ Terjadi kesalahan saat menyimpan data!");
      console.error(err);
    }
  };

  // 🔹 Filter pencarian pasien
  const filteredPasien = dataPasien.filter((p) =>
    `${p.no_rm} ${p.nama} ${p.alamat}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="p-4">⏳ Memuat data pasien...</p>;

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">🩺 Pilih Pasien Lama</h2>

      {/* 🔍 Pencarian */}
      <input
        type="text"
        placeholder="Cari pasien berdasarkan No. RM, Nama, atau Alamat..."
        className="mb-4 p-2 border rounded w-full max-w-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 🔹 Tabel daftar pasien */}
      {filteredPasien.length === 0 ? (
        <p className="text-gray-500">Pasien tidak ditemukan.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">No. RM</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Alamat</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredPasien.map((p) => (
              <tr key={p.no_rm} className="hover:bg-gray-50">
                <td className="border p-2">{p.no_rm}</td>
                <td className="border p-2">{p.nama}</td>
                <td className="border p-2">{p.alamat}</td>
                <td className="border p-2 text-center space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => (window.location.href = `/rekam-medis/${p.no_rm}`)}
                  >
                    Lihat Rekam Medis
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => handleTambahKunjungan(p)}
                  >
                    Tambah Kunjungan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🔹 Modal Tambah Kunjungan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[600px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">
              Tambah Kunjungan - {selectedPasien?.nama}
            </h3>

            {/* 🔹 Form Anamnesa */}
            <div className="space-y-2 mb-4">
              <input
                type="text"
                placeholder="KELUHAN"
                value={form.keluhan}
                onChange={(e) => setForm({ ...form, keluhan: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="RIWAYAT"
                value={form.riwayat}
                onChange={(e) => setForm({ ...form, riwayat: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="TENSI"
                value={form.tensi}
                onChange={(e) => setForm({ ...form, tensi: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <textarea
                placeholder="HASIL LAB"
                value={form.hasil_lab}
                onChange={(e) => setForm({ ...form, hasil_lab: e.target.value })}
                className="w-full border p-2 rounded h-24"
              />
            </div>

            {/* 🔹 Form Resep */}
            <h4 className="font-semibold mb-2">💊 Resep Obat</h4>
            {resepList.map((r, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Nama Obat"
                  value={r.nama_obat}
                  onChange={(e) => handleChangeObat(index, "nama_obat", e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Dosis"
                  value={r.dosis}
                  onChange={(e) => handleChangeObat(index, "dosis", e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Aturan Pakai"
                  value={r.aturan}
                  onChange={(e) => handleChangeObat(index, "aturan", e.target.value)}
                  className="border p-2 rounded"
                />
                <div className="col-span-3 text-right">
                  {index > 0 && (
                    <button
                      onClick={() => handleHapusObat(index)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Hapus Obat
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={handleTambahObat}
              className="mt-2 mb-4 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded text-sm"
            >
              ➕ Tambah Obat
            </button>

            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
