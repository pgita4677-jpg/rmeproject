"use client";
import React, { useEffect, useState } from "react";

interface Resep {
  obat: string;
  dosis: string;
  aturan: string;
}

interface Kunjungan {
  tanggal: string;
  keluhan: string;
  diagnosa: string;
  resep: Resep[];
  lab: string;
  hasilLab: string;
}

interface Pasien {
  noRM: string;
  nama: string;
  tanggalLahir: string;
  umur: string;
  jenisKelamin: string;
  alamat: string;
  telepon: string;
  tipePasien: "Baru" | "Lama";
  riwayat: Kunjungan[];
}

export default function RekamMedis() {
  const [daftarPasien, setDaftarPasien] = useState<Pasien[]>([]);
  const [filterRM, setFilterRM] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dataPasien") || "[]");
    setDaftarPasien(data);
  }, []);

  const filteredPasien = daftarPasien
    .map((p) => {
      const riwayatArray = p.riwayat || [];
      const riwayatFiltered = riwayatArray.filter(k => {
        const matchRM = filterRM === "" || p.noRM.toLowerCase().includes(filterRM.toLowerCase());
        const matchTanggal = filterTanggal === "" || k.tanggal === filterTanggal;
        return matchRM && matchTanggal;
      });
      return { ...p, riwayat: riwayatFiltered };
    })
    .filter(p => (p.riwayat || []).length > 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 text-black">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-6">
        📝 Rekam Medis Pasien
      </h1>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-2 mb-4 justify-center">
        <input
          placeholder="Filter No. RM"
          value={filterRM}
          onChange={(e) => setFilterRM(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="date"
          value={filterTanggal}
          onChange={(e) => setFilterTanggal(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full border border-gray-300 text-sm table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 border">No. RM</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Tipe</th>
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Keluhan</th>
              <th className="p-2 border">Diagnosa</th>
              <th className="p-2 border">Resep</th>
              <th className="p-2 border">Lab</th>
              <th className="p-2 border">Hasil Lab</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {filteredPasien.map((p, i) =>
              (p.riwayat || []).map((k, idx) => {
                const isLatest = idx === (p.riwayat?.length || 0) - 1;
                const highlightClass = isLatest
                  ? "bg-yellow-100 border-2 border-yellow-400 shadow-md"
                  : "";
                return (
                  <tr key={`${i}-${idx}`} className={`border hover:bg-gray-100 ${highlightClass}`}>
                    <td className="border p-2">{p.noRM}</td>
                    <td className="border p-2">{p.nama}</td>
                    <td className="border p-2">{p.tipePasien}</td>
                    <td className="border p-2">{k.tanggal}</td>
                    <td className="border p-2 text-left">
                      <ul className="list-disc ml-4">
                        {k.keluhan.split("\n").map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="border p-2 text-left">
                      <ul className="list-disc ml-4">
                        {k.diagnosa.split("\n").map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="border p-2 text-left">
                      <ul className="list-disc ml-4">
                        {(k.resep || []).map((r, i) => (
                          <li key={i}>💊 {r.obat} ({r.dosis}) - {r.aturan}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="border p-2 text-left">{k.lab}</td>
                    <td className="border p-2 text-left">{k.hasilLab}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
