"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type RekamMedis = {
  no_rm: string;
  nama: string;
  tanggal_kunjungan: string;
  diagnosa?: string;
};

export default function RekamMedisPage() {
  const [rekamMedis, setRekamMedis] = useState<RekamMedis[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/rekam-medis");
        const data = await res.json();
        if (data.success) setRekamMedis(data.data);
      } catch (error) {
        console.error("❌ Error fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p>Memuat data...</p>
      </div>
    );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        🩺 Daftar Rekam Medis
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">No RM</th>
              <th className="px-4 py-2 border">Nama Pasien</th>
              <th className="px-4 py-2 border">Tanggal Kunjungan</th>
              <th className="px-4 py-2 border">Diagnosa</th>
              <th className="px-4 py-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rekamMedis.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-6 italic"
                >
                  Tidak ada data rekam medis.
                </td>
              </tr>
            ) : (
              rekamMedis.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="border px-4 py-2">{item.no_rm}</td>
                  <td className="border px-4 py-2">{item.nama}</td>
                  <td className="border px-4 py-2">
                    {new Date(item.tanggal_kunjungan).toLocaleDateString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {item.diagnosa || "-"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => router.push(`/rekam-medis/${item.no_rm}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg transition"
                    >
                      Detail Rekam Medis
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
