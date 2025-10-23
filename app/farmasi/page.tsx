"use client";
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function FarmasiPage() {
  const [data, setData] = useState<any[]>([]);
  const [dari, setDari] = useState("");
  const [sampai, setSampai] = useState("");

  const fetchData = async () => {
    try {
      let url = "/api/farmasi";
      if (dari && sampai) url += `?dari=${dari}&sampai=${sampai}`;

      const res = await fetch(url);
      const json = await res.json();

      console.log("Respon API farmasi:", json);

      const items = Array.isArray(json) ? json : json.data || [];

      const grouped: any = {};
      items.forEach((item: any) => {
        const key = item.no_rm;
        if (!grouped[key]) {
          grouped[key] = {
            no_rm: item.no_rm,
            nama_pasien: item.nama_pasien,
            tanggal: item.tanggal,
            resep: [],
          };
        }
        grouped[key].resep.push({
          nama_obat: item.obat,
          dosis: item.dosis,
          aturan: item.aturan,
        });
      });

      setData(Object.values(grouped));
    } catch (error) {
      console.error("Gagal mengambil data farmasi:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Data Farmasi", 14, 15);

    data.forEach((pasien, index) => {
      // ✅ Gunakan optional chaining biar tidak error saat belum ada lastAutoTable
      const startY =
        index === 0 ? 25 : (doc as any).lastAutoTable?.finalY
          ? (doc as any).lastAutoTable.finalY + 10
          : 25;

      autoTable(doc, {
        startY,
        head: [[`${pasien.nama_pasien} (${pasien.no_rm})`, "Dosis", "Aturan"]],
        body: pasien.resep.map((r: any) => [r.nama_obat, r.dosis, r.aturan]),
      });
    });

    doc.save("Laporan_Farmasi_Per_Pasien.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
        💊 Data Farmasi
      </h1>

      {/* Filter tanggal */}
      <div className="flex gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-semibold mb-1">Dari tanggal</label>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={dari}
            onChange={(e) => setDari(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Sampai tanggal</label>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={sampai}
            onChange={(e) => setSampai(e.target.value)}
          />
        </div>
        <button
          onClick={fetchData}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          🔍 Tampilkan
        </button>

        <button
          onClick={handlePDF}
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📄 Download PDF
        </button>
      </div>

      {/* Tabel per pasien */}
      {data.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          Tidak ada data resep.
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((pasien: any, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg text-blue-700 mb-1">
                👤 {pasien.nama_pasien} ({pasien.no_rm})
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Tanggal: {pasien.tanggal?.split("T")[0]}
              </p>

              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Nama Obat</th>
                    <th className="border p-2">Dosis</th>
                    <th className="border p-2">Aturan</th>
                  </tr>
                </thead>
                <tbody>
                  {pasien.resep.map((r: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="border p-2">{r.nama_obat}</td>
                      <td className="border p-2">{r.dosis}</td>
                      <td className="border p-2">{r.aturan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      <div className="text-right mt-4 text-sm text-gray-600">
        Total pasien: {data.length}
      </div>
    </div>
  );
}
