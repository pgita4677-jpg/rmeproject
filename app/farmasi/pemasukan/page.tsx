"use client";
import React, { useState, useEffect } from "react";

export default function PemasukanObat() {
  const [stok, setStok] = useState<any[]>([]);
  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState<number>(0);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dataStok") || "[]");
    setStok(data);
  }, []);

  const tambahStok = () => {
    if (!nama || jumlah <= 0) return alert("Nama dan jumlah wajib diisi!");

    const index = stok.findIndex((item) => item.nama === nama);
    let dataBaru;

    if (index >= 0) {
      stok[index].jumlah += jumlah;
      dataBaru = [...stok];
    } else {
      dataBaru = [...stok, { nama, jumlah }];
    }

    setStok(dataBaru);
    localStorage.setItem("dataStok", JSON.stringify(dataBaru));
    alert("Stok obat berhasil ditambahkan!");
    setNama("");
    setJumlah(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        ➕ Pemasukan Obat
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Nama Obat"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
        />
        <input
          type="number"
          placeholder="Jumlah Masuk"
          value={jumlah}
          onChange={(e) => setJumlah(parseInt(e.target.value))}
          className="w-full border rounded-lg p-2 mb-3"
        />
        <button
          onClick={tambahStok}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg w-full"
        >
          Simpan Pemasukan
        </button>
      </div>
    </div>
  );
}
