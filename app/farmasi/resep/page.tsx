"use client";
import React, { useState, useEffect } from "react";

export default function ResepPasien() {
  const [dataPasien, setDataPasien] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dataPasien") || "[]");
    setDataPasien(data);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-black p-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
        🧾 Resep Pasien
      </h1>

      {dataPasien.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada data resep pasien.</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-2 border">No. RM</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Diagnosa</th>
              <th className="p-2 border">Resep Obat</th>
              <th className="p-2 border">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {dataPasien.map((p, i) => (
              <tr key={i} className="border text-center hover:bg-gray-100">
                <td className="p-2 border">{p.noRM || "-"}</td>
                <td className="p-2 border">{p.nama}</td>
                <td className="p-2 border">{p.diagnosa}</td>
                <td className="p-2 border text-left">
                  {p.resep?.map((r: any, idx: number) => (
                    <p key={idx}>💊 {r.obat} ({r.dosis}) - {r.aturan}</p>
                  ))}
                </td>
                <td className="p-2 border">{p.tanggal || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
