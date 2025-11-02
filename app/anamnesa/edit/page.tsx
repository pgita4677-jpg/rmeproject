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

  // 🔹 Ambil data anamnesa berdasarkan ID
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // ✅ gunakan endpoint sesuai route.ts di /api/anamnesa/[id]
        const res = await fetch(`/api/anamnesa/${id}`);

        if (!res.ok) {
          console.error(`HTTP Error ${res.status}`);
          setAnamnesa(null);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data?.success && data.data) {
          const a = data.data;
          let resepParsed: ResepItem[] = [];

          // ✅ Pastikan resep selalu array
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
        } else {
          setAnamnesa(null);
        }
      } catch (err) {
        console.error("Gagal memuat data anamnesa:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔹 Handler ubah teks biasa
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAnamnesa({ ...anamnesa, [e.target.name]: e.target.value });
  };

  // 🔹 Handler ubah isi resep
  const handleResepChange = (
    index: number,
    field: keyof ResepItem,
    value: string
  ) => {
    const newResep = [...(anamnesa.resep || [])];
    newResep[index][field] = value;
    setAnamnesa({ ...anamnesa, resep: newResep });
  };

  // 🔹 Tambah baris resep baru
  const tambahResep = () => {
    const newResep = [
      ...(anamnesa.resep || []),
      { obat: "", dosis: "", aturan: "" },
    ];
    setAnamnesa({ ...anamnesa, resep: newResep });
  };

  // 🔹 Simpan perubahan ke database
  const handleSave = async () => {
    try {
      // ✅ arahkan ke endpoint PUT /api/anamnesa/[id]
      const res = await fetch(`/api/anamnesa/${anamnesa.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(anamnesa),
      });

      let result;
      try {
        result = await res.json();
      } catch {
        const text = await res.text();
        console.error("⚠️ Response bukan JSON:", text);
        alert("Server tidak mengirim data JSON yang valid.");
        return;
      }

      if (result.success) {
        alert("✅ Data anamnesa berhasil diperbarui!");
        router.push(`/rekam-medis/${anamnesa.no_rm}`);
      } else {
        alert("❌ Gagal memperbarui data.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Terjadi kesalahan saat menyimpan data.");
    }
  };

  // 🔹 Tampilan loading / error
  if (loading) return <div className="p-6 text-gray-600">Memuat data...</div>;
  if (!anamnesa)
    return <div className="p-6 text-red-600">Data tidak ditemukan.</div>;

  // 🔹 Render UI form edit
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-sky-700">
        Edit Anamnesa
      </h2>

      <div className="space-y-4">
        {/* Keluhan */}
        <div>
          <label className="block font-medium">Keluhan</label>
          <textarea
            name="keluhan"
            value={anamnesa.keluhan || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Riwayat */}
        <div>
          <label className="block font-medium">Riwayat</label>
          <textarea
            name="riwayat"
            value={anamnesa.riwayat || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Resep Obat */}
        <h3 className="text-lg font-semibold text-sky-600 mt-6 mb-2">
          Resep Obat
        </h3>
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
              onChange={(e) =>
                handleResepChange(index, "dosis", e.target.value)
              }
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="text"
              placeholder="Aturan Pakai"
              value={r.aturan}
              onChange={(e) =>
                handleResepChange(index, "aturan", e.target.value)
              }
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

        {/* Tombol Aksi */}
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
