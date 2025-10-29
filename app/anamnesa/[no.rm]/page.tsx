"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface ResepItem {
  nama_obat: string;
  dosis: string;
  aturan: string;
  status_cocok: string;
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
    { nama_obat: "", dosis: "", aturan: "", status_cocok: "cocok" },
  ]);

  const [saving, setSaving] = useState(false);

  // 🔹 Fungsi cek kecocokan otomatis
  const cekKecocokan = (riwayat: string, nama_obat: string) => {
    const alergiList = ["amoxicillin", "ibuprofen"];
    const hipertensiDilarang = ["pseudoephedrine", "phenylephrine"];

    const obat = nama_obat.toLowerCase();
    const riwayatLower = riwayat.toLowerCase();

    if (alergiList.some((a) => obat.includes(a))) return "tidak_cocok";
    if (riwayatLower.includes("hipertensi") && hipertensiDilarang.some((a) => obat.includes(a)))
      return "tidak_cocok";

    return "cocok";
  };

  // 🧠 Update form anamnesa
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    // 🔁 Jika riwayat berubah, perbarui status cocok semua resep
    if (name === "riwayat") {
      const updatedResep = resepList.map((r) => ({
        ...r,
        status_cocok: cekKecocokan(value, r.nama_obat),
      }));
      setResepList(updatedResep);
    }
  };

  // 💊 Update resep
  const handleResepChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newResep = [...resepList];
    newResep[index][name as keyof ResepItem] = value;

    if (name === "nama_obat") {
      newResep[index].status_cocok = cekKecocokan(form.riwayat, value);
    }

    setResepList(newResep);
  };

  const addResep = () => {
    setResepList([...resepList, { nama_obat: "", dosis: "", aturan: "", status_cocok: "cocok" }]);
  };

  const removeResep = (index: number) => {
    setResepList(resepList.filter((_, i) => i !== index));
  };

  // 💾 Simpan data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    if (!no_rm) return alert("❌ No RM tidak ditemukan.");
    if (!form.keluhan.trim()) return alert("❌ Keluhan wajib diisi.");

    setSaving(true);

    try {
      // Simpan anamnesa
      const resAnamnesa = await fetch("/api/anamnesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no_rm, ...form }),
      });

      const dataAnamnesa = await resAnamnesa.json();
      const anamnesa_id = dataAnamnesa.insertId;

      // Simpan resep
      const resepValid = resepList.filter((r) => r.nama_obat.trim() !== "");
      for (const r of resepValid) {
        await fetch("/api/resep", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            no_rm,
            anamnesa_id,
            ...r,
          }),
        });
      }

      alert("✅ Data berhasil disimpan!");
      router.push(`/rekam-medis/${no_rm}`);
    } catch (err: any) {
      console.error(err);
      alert("❌ Gagal menyimpan data: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">🩺 Tambah Anamnesa Pasien {no_rm}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea name="keluhan" placeholder="Keluhan" value={form.keluhan} onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="riwayat" placeholder="Riwayat Penyakit" value={form.riwayat} onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="tensi" placeholder="Tensi" value={form.tensi} onChange={handleChange} className="w-full border p-2 rounded" />
        <textarea name="hasil_lab" placeholder="Hasil Lab" value={form.hasil_lab} onChange={handleChange} className="w-full border p-2 rounded" />

        {/* 💊 Daftar Resep */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">💊 Resep Obat</h2>

          {resepList.map((r, i) => (
            <div key={i} className={`mb-3 border p-3 rounded ${r.status_cocok === "tidak_cocok" ? "bg-red-100 border-red-400" : "bg-green-50 border-green-400"}`}>
              <input type="text" name="nama_obat" placeholder="Nama Obat" value={r.nama_obat} onChange={(e) => handleResepChange(i, e)} className="w-full border p-2 rounded mb-2" />
              <input type="text" name="dosis" placeholder="Dosis" value={r.dosis} onChange={(e) => handleResepChange(i, e)} className="w-full border p-2 rounded mb-2" />
              <input type="text" name="aturan" placeholder="Aturan Pakai" value={r.aturan} onChange={(e) => handleResepChange(i, e)} className="w-full border p-2 rounded mb-2" />
              <select name="status_cocok" value={r.status_cocok} onChange={(e) => handleResepChange(i, e)} className="w-full border p-2 rounded">
                <option value="cocok">🟢 Cocok</option>
                <option value="tidak_cocok">🔴 Tidak Cocok</option>
              </select>

              {i > 0 && (
                <button type="button" onClick={() => removeResep(i)} className="text-red-600 text-sm underline mt-1">
                  Hapus Obat
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addResep} className="bg-green-500 text-white px-3 py-1 rounded mt-2">
            + Tambah Obat
          </button>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan & Lihat Rekam Medis"}
        </button>
      </form>
    </div>
  );
}
