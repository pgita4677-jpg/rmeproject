"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function ResepPasien() {
  const [dataPasien, setDataPasien] = useState<any[]>([]);
  const [namaObat, setNamaObat] = useState("");
  const [dosis, setDosis] = useState("");
  const [aturan, setAturan] = useState("");
  const [statusCocok, setStatusCocok] = useState("cocok");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dataPasien") || "[]");
    setDataPasien(data);
  }, []);

  // 🔹 Fungsi tambah resep
  const handleTambahResep = async (no_rm: string, nama_pasien: string, diagnosa: string) => {
    if (!namaObat) {
      Swal.fire("Peringatan", "Nama obat wajib diisi!", "warning");
      return;
    }

    try {
      Swal.fire({
        title: "Menyimpan...",
        text: "Sedang menambah resep baru",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch("/api/resep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anamnesa_id: 1, // sementara statis, nanti bisa disesuaikan
          no_rm,
          nama_pasien,
          diagnosa,
          nama_obat: namaObat,
          dosis,
          aturan,
          status_cocok: statusCocok,
        }),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire("Berhasil!", "Resep berhasil disimpan 💊", "success");
        setNamaObat("");
        setDosis("");
        setAturan("");
        setStatusCocok("cocok");
      } else {
        Swal.fire("Gagal", result.message || "Gagal menyimpan resep", "error");
      }
    } catch (err) {
      Swal.fire("Error", String(err), "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black p-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
        🧾 Resep Pasien
      </h1>

      {/* 🔸 Form tambah resep */}
      <div className="bg-white p-4 shadow rounded mb-8 max-w-lg mx-auto">
        <h2 className="text-lg font-semibold mb-3 text-purple-700">Tambah Resep Baru</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nama Obat"
            value={namaObat}
            onChange={(e) => setNamaObat(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Dosis"
            value={dosis}
            onChange={(e) => setDosis(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Aturan Pakai"
            value={aturan}
            onChange={(e) => setAturan(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={statusCocok}
            onChange={(e) => setStatusCocok(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="cocok">🟢 Cocok</option>
            <option value="tidak_cocok">🔴 Tidak Cocok</option>
          </select>

          {/* Tombol simpan resep */}
          <button
            onClick={() => {
              if (dataPasien.length > 0) {
                const p = dataPasien[0]; // ambil pasien pertama untuk contoh
                handleTambahResep(p.noRM, p.nama, p.diagnosa);
              } else {
                Swal.fire("Belum ada pasien", "Tidak ada data pasien di localStorage", "warning");
              }
            }}
            className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
          >
            Simpan Resep
          </button>
        </div>
      </div>

      {/* 🔸 Tabel resep pasien */}
      {dataPasien.length === 0 ? (
        <p className="text-center text-gray-500">
          Belum ada data resep pasien.
        </p>
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
                    <div key={idx} className="flex items-center gap-2">
                      <p>
                        💊 {r.obat} ({r.dosis}) - {r.aturan}
                      </p>
                      {r.status_cocok && (
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            r.status_cocok === "cocok"
                              ? "bg-green-100 text-green-700 border border-green-400"
                              : "bg-red-100 text-red-700 border border-red-400"
                          }`}
                        >
                          {r.status_cocok === "cocok"
                            ? "Cocok ✅"
                            : "Tidak Cocok ❌"}
                        </span>
                      )}
                    </div>
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
