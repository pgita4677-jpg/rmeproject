"use client";
import React, { useState, useEffect } from "react";

export default function StokObat() {
  const [stok, setStok] = useState<any[]>([]);
  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState<number>(0);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dataStok") || "[]");
    setStok(data);
  }, []);

  const tambahObat = () => {
    if (!nama || jumlah <= 0) return alert("Nama dan jumlah wajib diisi!");
    const dataBaru = [...stok, { nama, jumlah }];
    setStok(dataBaru);
    localStorage.setItem("dataStok", JSON.stringify(dataBaru));
    setNama("");
    setJumlah(0);
  };

  const hapusObat = (index: number) => {
    const dataBaru = stok.filter((_, i) => i !== index);
    setStok(dataBaru);
    localStorage.setItem("dataStok", JSON.stringify(dataBaru));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">📦 Manajemen Stok Obat</h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="font-semibold mb-3 text-lg">Tambah Obat Baru</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Nama obat"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="border rounded-lg px-3 py-2 w-1/2"
          />
          <input
            type="number"
            placeholder="Jumlah"
            value={jumlah}
            onChange={(e) => setJumlah(parseInt(e.target.value))}
            className="border rounded-lg px-3 py-2 w-1/4"
          />
          <button
            onClick={tambahObat}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Tambah
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="font-semibold mb-3 text-lg">Daftar Stok Obat</h2>
        {stok.length === 0 ? (
          <p className="text-gray-500">Belum ada data obat.</p>
        ) : (
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2 border">No</th>
                <th className="p-2 border">Nama Obat</th>
                <th className="p-2 border">Jumlah</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {stok.map((item, i) => (
                <tr key={i} className="border hover:bg-gray-100 text-center">
                  <td className="p-2 border">{i + 1}</td>
                  <td className="p-2 border">{item.nama}</td>
                  <td className="p-2 border">{item.jumlah}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => hapusObat(i)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
