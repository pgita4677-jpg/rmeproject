"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PasienTmp = {
  no_rm?: string;
  nama?: string;
  tanggal_lahir?: string;
  usia?: string;
  jenis_kelamin?: string;
  alamat?: string;
  no_hp?: string;
  nik?: string;
};

type ResepItem = { nama_obat: string; dosis: string; aturan: string };

export default function AnamnesaPage() {
  const router = useRouter();
  const [pasien, setPasien] = useState<PasienTmp | null>(null);
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

  useEffect(() => {
    const tmp = sessionStorage.getItem("rme_patient_tmp");
    if (tmp) {
      try {
        setPasien(JSON.parse(tmp));
      } catch {
        setPasien(null);
      }
    } else {
      // jika tidak ada data pasien sementara, redirect balik ke add
      router.push("/pasien/add");
    }
  }, [router]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResepChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const copy = [...resepList];
    (copy[idx] as any)[e.target.name] = e.target.value;
    setResepList(copy);
  };

  const addResep = () =>
    setResepList([...resepList, { nama_obat: "", dosis: "", aturan: "" }]);
  const removeResep = (i: number) =>
    setResepList(resepList.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pasien) {
      alert("Data pasien tidak ditemukan. Mulai lagi dari tambah pasien.");
      router.push("/pasien/add");
      return;
    }

    if (!form.keluhan.trim()) {
      alert("Keluhan wajib diisi");
      return;
    }

    const resepToSave = resepList.filter((r) => r.nama_obat.trim() !== "");

    const payload = {
      pasien, // object pasien (may include no_rm if user provided)
      anamnesa: form,
      resep: resepToSave,
    };

    try {
      setSaving(true);
      const res = await fetch("/api/rekam-medis/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        console.error("Gagal simpan lengkap:", data);
        alert("Gagal menyimpan rekam medis: " + (data.message || "server error"));
        setSaving(false);
        return;
      }

      // bersihkan tmp
      sessionStorage.removeItem("rme_patient_tmp");

      // redirect ke rekam-medis dengan no_rm returned dari server
      const no_rm = data.no_rm;
      router.push(`/rekam-medis/${encodeURIComponent(no_rm)}`);
    } catch (err: any) {
      console.error("Error:", err);
      alert("Terjadi kesalahan saat menyimpan.");
      setSaving(false);
    }
  };

  if (!pasien) return <p className="p-6">⏳ Memuat data pasien...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🩺 Anamnesa — {pasien.nama || "Pasien"}</h1>

      <div className="bg-gray-50 p-4 rounded">
        <p><strong>No. RM (sementara):</strong> {pasien.no_rm || "(kosong)"}</p>
        <p><strong>Nama:</strong> {pasien.nama || "-"}</p>
        <p><strong>Usia:</strong> {pasien.usia || "-"}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="keluhan"
          placeholder="Keluhan"
          value={form.keluhan}
          onChange={handleFormChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="riwayat"
          placeholder="Riwayat Penyakit"
          value={form.riwayat}
          onChange={handleFormChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="tensi"
          placeholder="Tensi"
          value={form.tensi}
          onChange={(e) => handleFormChange(e as any)}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="hasil_lab"
          placeholder="Hasil Lab"
          value={form.hasil_lab}
          onChange={handleFormChange}
          className="w-full border p-2 rounded"
        />

        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold">💊 Resep Obat</h2>

          {resepList.map((r, idx) => (
            <div key={idx} className="mb-3 border p-3 rounded bg-blue-50">
              <input
                name="nama_obat"
                value={r.nama_obat}
                onChange={(e) => handleResepChange(idx, e)}
                placeholder="Nama Obat"
                className="w-full border p-2 rounded mb-2"
              />
              <input
                name="dosis"
                value={r.dosis}
                onChange={(e) => handleResepChange(idx, e)}
                placeholder="Dosis"
                className="w-full border p-2 rounded mb-2"
              />
              <input
                name="aturan"
                value={r.aturan}
                onChange={(e) => handleResepChange(idx, e)}
                placeholder="Aturan Pakai"
                className="w-full border p-2 rounded mb-2"
              />
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => removeResep(idx)}
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

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan Rekam Medis"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/pasien/add")}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Kembali ke Pasien
          </button>
        </div>
      </form>
    </div>
  );
}
