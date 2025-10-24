"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ResepItem {
  obat: string;
  dosis: string;
  aturan: string;
}

export default function EditAnamnesaPage() {

  
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [anamnesa, setAnamnesa] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ambil data anamnesa berdasarkan id
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/anamnesa?id=${id}`);
        const data = await res.json();

        if (data?.success && data.data?.length > 0) {
          const a = data.data[0];
          let resepParsed: ResepItem[] = [];

          // pastikan resep selalu array
          if (Array.isArray(a.resep)) {
            resepParsed = a.resep;
          } else if (typeof a.resep === "string" && a.resep.trim() !== "") {
            try {
              resepParsed = JSON.parse(a.resep);
            } catch {
              resepParsed = [];
            }
          }

          setAnamnesa({ ...a, resep: resepParsed });
        }
      } catch (err) {
        console.error("Gagal memuat data anamnesa:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // handler untuk update field teks biasa
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAnamnesa({ ...anamnesa, [e.target.name]: e.target.value });
  };

  // handler untuk ubah isi resep
  const handleResepChange = (index: number, field: keyof ResepItem, value: string) => {
    const newResep = [...(anamnesa.resep || [])];
    newResep[index][field] = value;
    setAnamnesa({ ...anamnesa, resep: newResep });
  };

  // tambah baris resep baru
  const tambahResep = () => {
    const newResep = [...(anamnesa.resep || []), { obat: "", dosis: "", aturan: "" }];
    setAnamnesa({ ...anamnesa, resep: newResep });
  };

  // simpan perubahan
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/anamnesa`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(anamnesa),
      });

      const result = await res.json();
      if (result.success) {
        alert("Data anamnesa berhasil diperbarui 💙");
        router.push(`/rekam-medis/${anamnesa.no_rm}`);
      } else {
        alert("Gagal memperbarui data.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Memuat data...</div>;
  if (!anamnesa) return <div className="p-6 text-red-600">Data tidak ditemukan.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-sky-700">Edit Anamnesa</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Keluhan</label>
          <textarea
            name="keluhan"
            value={anamnesa.keluhan || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Riwayat</label>
          <textarea
            name="riwayat"
            value={anamnesa.riwayat || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <h3 className="text-lg font-semibold text-sky-600 mt-6 mb-2">Resep Obat</h3>
        {(anamnesa.resep || []).map((r: ResepItem, index: number) => (
          <div key={index} className="border rounded-lg p-3 mb-2 bg-sky-50">
            <input
              type="text"
              placeholder="Nama Obat"
              value={r.obat}
              onChange={(e) => handleResepChange(index, "obat", e.target.value)}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="text"
              placeholder="Dosis"
              value={r.dosis}
              onChange={(e) => handleResepChange(index, "dosis", e.target.value)}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="text"
              placeholder="Aturan Pakai"
              value={r.aturan}
              onChange={(e) => handleResepChange(index, "aturan", e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={tambahResep}
          className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600"
        >
          + Tambah Resep
        </button>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => router.back()}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
