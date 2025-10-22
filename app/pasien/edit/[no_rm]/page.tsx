"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 🧩 Definisi props dari folder dinamis [no_rm]
interface PageProps {
  params: {
    no_rm: string;
  };
}

export default function EditPasienPage({ params }: PageProps) {
  const { no_rm } = params;
  const router = useRouter();

  const [pasien, setPasien] = useState({
    nama: "",
    umur: "",
    alamat: "",
    kelamin: "",
  });

  // 🔹 Ambil data pasien berdasarkan no_rm
  useEffect(() => {
    async function fetchPasien() {
      try {
        const res = await fetch(`/api/pasien/${no_rm}`);
        const data = await res.json();
        if (data.success) {
          setPasien(data.pasien);
        } else {
          alert("Data pasien tidak ditemukan");
        }
      } catch (err) {
        console.error("Gagal mengambil data pasien:", err);
      }
    }

    if (no_rm) fetchPasien();
  }, [no_rm]);

  // 🔹 Fungsi simpan perubahan
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
        alert("Data pasien berhasil diperbarui!");
        router.push("/pasien");
      } else {
        alert("Gagal memperbarui data pasien!");
      }
    } catch (err) {
      console.error("Gagal update pasien:", err);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Edit Data Pasien – No RM: {no_rm}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nama Pasien</label>
          <input
            type="text"
            value={pasien.nama}
            onChange={(e) => setPasien({ ...pasien, nama: e.target.value })}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Umur</label>
          <input
            type="number"
            value={pasien.umur}
            onChange={(e) => setPasien({ ...pasien, umur: e.target.value })}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Alamat</label>
          <input
            type="text"
            value={pasien.alamat}
            onChange={(e) => setPasien({ ...pasien, alamat: e.target.value })}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Jenis Kelamin</label>
          <select
            value={pasien.kelamin}
            onChange={(e) => setPasien({ ...pasien, kelamin: e.target.value })}
            className="w-full border rounded p-2"
            required
          >
            <option value="">-- Pilih --</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
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
