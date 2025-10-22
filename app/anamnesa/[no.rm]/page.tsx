"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface ResepItem {
  nama_obat: string;
  dosis: string;
  aturan: string;
}

export default function AnamnesaPage() {
  const { no_rm } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    keluhan: "",
    riwayat: "",
    tensi: "",
    hasil_lab: "",
  });

  const [resepList, setResepList] = useState<ResepItem[]>([
    { nama_obat: "", dosis: "", aturan: "" },
  ]);

  const [saving, setSaving] = useState(false);

  // update field form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // update resep
  const handleResepChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newResep = [...resepList];
    newResep[index][e.target.name as keyof ResepItem] = e.target.value;
    setResepList(newResep);
  };

  const addResep = () => {
    setResepList([...resepList, { nama_obat: "", dosis: "", aturan: "" }]);
  };

  const removeResep = (index: number) => {
    setResepList(resepList.filter((_, i) => i !== index));
  };

  // submit form + debug-ready
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    // validasi no_rm
    if (!no_rm) {
      alert("❌ No RM pasien tidak ditemukan. Tidak bisa menyimpan.");
      return;
    }

    // validasi keluhan
    if (!form.keluhan.trim()) {
      alert("❌ Keluhan wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      console.log("🔹 Mengirim data anamnesa:", { no_rm, ...form });

      // simpan anamnesa
      const resAnamnesa = await fetch("/api/anamnesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no_rm, ...form }),
      });

      const text = await resAnamnesa.text();
      console.log("🔹 Response status:", resAnamnesa.status);
      console.log("🔹 Response body:", text);

      if (!resAnamnesa.ok) {
        throw new Error(`Gagal menyimpan anamnesa. Status ${resAnamnesa.status}: ${text}`);
      }

      const dataAnamnesa = JSON.parse(text);
      const anamnesa_id = dataAnamnesa.insertId;
      console.log("✅ Anamnesa tersimpan, ID:", anamnesa_id);

      // simpan resep
      const resepValid = resepList.filter((r) => r.nama_obat.trim() !== "");
      if (resepValid.length > 0) {
        for (const r of resepValid) {
          const resResep = await fetch("/api/resep", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              no_rm,
              anamnesa_id,
              nama_obat: r.nama_obat,
              dosis: r.dosis,
              aturan: r.aturan,
            }),
          });

          const resText = await resResep.text();
          console.log(`🔹 Resep ${r.nama_obat} status:`, resResep.status, "body:", resText);

          if (!resResep.ok) {
            throw new Error(
              `Gagal menyimpan resep ${r.nama_obat}. Status ${resResep.status}: ${resText}`
            );
          }
        }
      }

      alert("✅ Data berhasil disimpan!");
      router.push(`/rekam-medis/${no_rm}`);
    } catch (err: any) {
      console.error("❌ Error saat submit:", err);
      alert("❌ Terjadi kesalahan saat menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">🩺 Tambah Anamnesa Pasien {no_rm}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="keluhan"
          placeholder="Keluhan"
          value={form.keluhan}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="riwayat"
          placeholder="Riwayat Penyakit"
          value={form.riwayat}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="tensi"
          placeholder="Tensi"
          value={form.tensi}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="hasil_lab"
          placeholder="Hasil Lab"
          value={form.hasil_lab}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Resep */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">💊 Resep Obat</h2>

          {resepList.map((r, index) => (
            <div key={index} className="mb-3 border p-3 rounded bg-blue-50">
              <input
                type="text"
                name="nama_obat"
                placeholder="Nama Obat"
                value={r.nama_obat}
                onChange={(e) => handleResepChange(index, e)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="dosis"
                placeholder="Dosis"
                value={r.dosis}
                onChange={(e) => handleResepChange(index, e)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="aturan"
                placeholder="Aturan Pakai"
                value={r.aturan}
                onChange={(e) => handleResepChange(index, e)}
                className="w-full border p-2 rounded mb-2"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeResep(index)}
                  className="text-red-600 text-sm underline"
                >
                  Hapus Obat
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addResep}
            className="bg-green-500 text-white px-3 py-1 rounded mt-2"
          >
            + Tambah Obat
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
          disabled={saving}
        >
          {saving ? "Menyimpan..." : "Simpan & Lihat Rekam Medis"}
        </button>
      </form>
    </div>
  );
}
