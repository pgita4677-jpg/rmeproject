"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: { no_rm: string };
}

export default function EditPasienPage({ params }: PageProps) {
  const { no_rm } = params;
  const router = useRouter();

  const [pasien, setPasien] = useState({
    nama: "",
    tanggal_lahir: "",
    usia: "",
    jenis_kelamin: "",
    alamat: "",
    no_hp: "",
    nik: "",
  });

  useEffect(() => {
    async function fetchPasien() {
      try {
        const res = await fetch(`/api/pasien/${no_rm}`);
        const data = await res.json();

        if (data.success && data.data) {
          setPasien(data.data);
        } else {
          alert(data.message || "Pasien tidak ditemukan!");
        }
      } catch (err) {
        console.error("Gagal mengambil data pasien:", err);
      }
    }

    if (no_rm) fetchPasien();
  }, [no_rm]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(`/api/pasien/${no_rm}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pasien),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Data pasien berhasil diperbarui!");
        router.push("/pasien");
      } else {
        alert(data.message || "Gagal memperbarui data pasien!");
      }
    } catch (err) {
      console.error("Gagal update pasien:", err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Edit Data Pasien – No RM: {no_rm}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Nama</label>
          <input
            value={pasien.nama}
            onChange={(e) => setPasien({ ...pasien, nama: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block">Tanggal Lahir</label>
          <input
            type="date"
            value={pasien.tanggal_lahir?.split("T")[0] || ""}
            onChange={(e) =>
              setPasien({ ...pasien, tanggal_lahir: e.target.value })
            }
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block">Usia</label>
          <input
            type="number"
            value={pasien.usia}
            onChange={(e) => setPasien({ ...pasien, usia: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block">Jenis Kelamin</label>
          <select
            value={pasien.jenis_kelamin}
            onChange={(e) =>
              setPasien({ ...pasien, jenis_kelamin: e.target.value })
            }
            className="border p-2 w-full rounded"
            required
          >
            <option value="">-- Pilih --</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div>
          <label className="block">Alamat</label>
          <input
            value={pasien.alamat}
            onChange={(e) => setPasien({ ...pasien, alamat: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block">No. HP</label>
          <input
            value={pasien.no_hp}
            onChange={(e) => setPasien({ ...pasien, no_hp: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block">NIK</label>
          <input
            value={pasien.nik}
            onChange={(e) => setPasien({ ...pasien, nik: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
