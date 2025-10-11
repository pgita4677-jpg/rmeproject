"use client";
import React, { useState } from "react";

interface Obat {
  id: number;
  nama: string;
  stok: number;
  pemasukan: number;
  pengeluaran: number;
}

interface Resep {
  id: number;
  namaPasien: string;
  namaObat: string;
  jumlah: number;
  tanggal: string;
}

export default function FarmasiPage() {
  const [obatList, setObatList] = useState<Obat[]>([
    { id: 1, nama: "Paracetamol", stok: 100, pemasukan: 50, pengeluaran: 20 },
    { id: 2, nama: "Amoxicillin", stok: 80, pemasukan: 30, pengeluaran: 10 },
  ]);

  const [resepList, setResepList] = useState<Resep[]>([
    { id: 1, namaPasien: "Budi", namaObat: "Paracetamol", jumlah: 10, tanggal: "2025-10-11" },
  ]);

  const [newObat, setNewObat] = useState({ nama: "", stok: 0, pemasukan: 0, pengeluaran: 0 });
  const [newResep, setNewResep] = useState({ namaPasien: "", namaObat: "", jumlah: 0, tanggal: "" });

  // Tambah obat baru
  const tambahObat = () => {
    if (!newObat.nama) return;
    setObatList([
      ...obatList,
      {
        id: obatList.length + 1,
        nama: newObat.nama,
        stok: newObat.stok,
        pemasukan: newObat.pemasukan,
        pengeluaran: newObat.pengeluaran,
      },
    ]);
    setNewObat({ nama: "", stok: 0, pemasukan: 0, pengeluaran: 0 });
  };

  // Tambah resep baru
  const tambahResep = () => {
    if (!newResep.namaPasien || !newResep.namaObat) return;
    setResepList([
      ...resepList,
      {
        id: resepList.length + 1,
        namaPasien: newResep.namaPasien,
        namaObat: newResep.namaObat,
        jumlah: newResep.jumlah,
        tanggal: newResep.tanggal,
      },
    ]);
    setNewResep({ namaPasien: "", namaObat: "", jumlah: 0, tanggal: "" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">💊 Manajemen Farmasi</h1>

      {/* === Bagian Stok Obat === */}
      <section className="mb-10 bg-gray-100 p-5 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">📦 Stok Obat</h2>

        <div className="grid grid-cols-5 gap-3 mb-4">
          <input
            type="text"
            placeholder="Nama obat"
            value={newObat.nama}
            onChange={(e) => setNewObat({ ...newObat, nama: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Stok awal"
            value={newObat.stok}
            onChange={(e) => setNewObat({ ...newObat, stok: Number(e.target.value) })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Pemasukan"
            value={newObat.pemasukan}
            onChange={(e) => setNewObat({ ...newObat, pemasukan: Number(e.target.value) })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Pengeluaran"
            value={newObat.pengeluaran}
            onChange={(e) => setNewObat({ ...newObat, pengeluaran: Number(e.target.value) })}
            className="border p-2 rounded"
          />
          <button
            onClick={tambahObat}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tambah Obat
          </button>
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-blue-200 text-left">
            <tr>
              <th className="p-2 border">Nama Obat</th>
              <th className="p-2 border">Stok</th>
              <th className="p-2 border">Pemasukan</th>
              <th className="p-2 border">Pengeluaran</th>
              <th className="p-2 border">Sisa</th>
            </tr>
          </thead>
          <tbody>
            {obatList.map((o) => (
              <tr key={o.id}>
                <td className="border p-2">{o.nama}</td>
                <td className="border p-2">{o.stok}</td>
                <td className="border p-2">{o.pemasukan}</td>
                <td className="border p-2">{o.pengeluaran}</td>
                <td className="border p-2 font-semibold">{o.stok + o.pemasukan - o.pengeluaran}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* === Bagian Resep Pasien === */}
      <section className="bg-gray-100 p-5 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">🧾 Resep Pasien</h2>

        <div className="grid grid-cols-5 gap-3 mb-4">
          <input
            type="text"
            placeholder="Nama Pasien"
            value={newResep.namaPasien}
            onChange={(e) => setNewResep({ ...newResep, namaPasien: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Nama Obat"
            value={newResep.namaObat}
            onChange={(e) => setNewResep({ ...newResep, namaObat: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Jumlah"
            value={newResep.jumlah}
            onChange={(e) => setNewResep({ ...newResep, jumlah: Number(e.target.value) })}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={newResep.tanggal}
            onChange={(e) => setNewResep({ ...newResep, tanggal: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            onClick={tambahResep}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Tambah Resep
          </button>
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-green-200 text-left">
            <tr>
              <th className="p-2 border">Nama Pasien</th>
              <th className="p-2 border">Nama Obat</th>
              <th className="p-2 border">Jumlah</th>
              <th className="p-2 border">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {resepList.map((r) => (
              <tr key={r.id}>
                <td className="border p-2">{r.namaPasien}</td>
                <td className="border p-2">{r.namaObat}</td>
                <td className="border p-2">{r.jumlah}</td>
                <td className="border p-2">{r.tanggal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
