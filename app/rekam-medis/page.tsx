"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function RekamMedisPage() {
  const [rekamList, setRekamList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // 🔹 Ambil data rekam medis dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/rekam-medis", { cache: "no-store" });
        if (!res.ok) throw new Error("Gagal memuat data");

        const data = await res.json();
        const records = Array.isArray(data) ? data : data.data || [];

        setRekamList(records);
        setFilteredList(records);
        setError("");
      } catch (err: any) {
        console.error("❌ Error ambil data:", err);
        setError("Gagal memuat data rekam medis.");
        setRekamList([]);
        setFilteredList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Filter pencarian
  useEffect(() => {
    const filtered = rekamList.filter(
      (r) =>
        r.no_rm?.toLowerCase().includes(search.toLowerCase()) ||
        r.nama?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, rekamList]);

  // 🔹 Export PDF
  const handlePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Laporan Rekam Medis Pasien", 14, 15);
    doc.setFontSize(11);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`, 14, 25);

    autoTable(doc, {
      startY: 35,
      head: [["No RM", "Nama", "Keluhan Terakhir", "Tanggal Terakhir"]],
      body: filteredList.map((r) => [
        r.no_rm,
        r.nama,
        r.keluhan || "-",
        r.tanggal_terakhir
          ? new Date(r.tanggal_terakhir).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "-",
      ]),
    });

    const total = filteredList.length;
    doc.text(`Total Pasien: ${total}`, 14, (doc as any).lastAutoTable.finalY + 10);

    const pageCount = (doc as any).internal.getNumberOfPages?.() || 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Halaman ${i} dari ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    doc.save("Laporan_Rekam_Medis.pdf");
  };

  if (loading) return <p className="text-center py-10">Memuat data...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Daftar Rekam Medis Pasien</h1>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Cari nama atau No RM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            onClick={handlePDF}
            className="border text-sm px-4 py-2 rounded hover:bg-gray-100"
            title="Download laporan rekam medis dalam format PDF"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">No RM</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Keluhan Terakhir</th>
              <th className="border p-2">Tanggal Terakhir</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map((r) => (
                <tr key={r.no_rm}>
                  <td className="border p-2">{r.no_rm}</td>
                  <td className="border p-2">{r.nama}</td>
                  <td className="border p-2">{r.keluhan || "-"}</td>
                  <td className="border p-2">
                    {r.tanggal_terakhir
                      ? new Date(r.tanggal_terakhir).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => router.push(`/rekam-medis/${r.no_rm}`)}
                      className="border px-3 py-1 rounded hover:bg-gray-100"
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border text-center text-gray-500 p-3 italic">
                  Tidak ada data pasien yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="bg-gray-50 p-3 text-right text-sm font-medium">
          Total Pasien: {filteredList.length}
        </div>
      </div>
    </div>
  );
}
