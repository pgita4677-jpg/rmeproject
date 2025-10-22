"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TambahPasienPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    no_rm: "",
    nama: "",
    tanggal_lahir: "",
    usia: "",
    jenis_kelamin: "",
    no_hp: "",
    alamat: "",
    nik: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔢 Generate No RM otomatis & unik
  useEffect(() => {
    const generateNoRM = () => {
      const random = Math.floor(1000 + Math.random() * 9000);
      return `RM${new Date().getFullYear()}${random}`;
    };
    setFormData((prev) => ({ ...prev, no_rm: generateNoRM() }));
  }, []);

  // 🧠 Hitung usia otomatis
  const handleTanggalLahir = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tanggal = e.target.value;
    const tahunLahir = new Date(tanggal).getFullYear();
    const tahunSekarang = new Date().getFullYear();
    const usia = tahunSekarang - tahunLahir;
    setFormData((prev) => ({
      ...prev,
      tanggal_lahir: tanggal,
      usia: usia.toString(),
    }));
  };

  // 🔄 Handle input umum
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 💾 Simpan sementara & lanjut ke anamnesa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validasi ringan
      if (!formData.nama.trim()) {
        alert("❌ Nama pasien wajib diisi!");
        setLoading(false);
        return;
      }

      // Simpan data sementara ke sessionStorage
      sessionStorage.setItem("rme_patient_tmp", JSON.stringify(formData));

      // Redirect ke halaman anamnesa (tanpa menyimpan ke DB dulu)
      router.push("/anamnesa");
    } catch (err) {
      console.error("🔥 Error simpan sementara pasien:", err);
      alert("Terjadi kesalahan saat menyiapkan data pasien.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🩺 Tambah Data Pasien Baru
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* No RM */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Nomor Rekam Medis (No. RM)
            </label>
            <input
              type="text"
              name="no_rm"
              value={formData.no_rm}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          {/* Nama */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Nama Pasien
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Jenis Kelamin
            </label>
            <select
              name="jenis_kelamin"
              value={formData.jenis_kelamin}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* Tanggal Lahir + Usia */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleTanggalLahir}
                required
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Usia
              </label>
              <input
                type="text"
                name="usia"
                value={formData.usia}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
          </div>

          {/* NIK */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">NIK</label>
            <input
              type="text"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* No HP */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">No. HP</label>
            <input
              type="text"
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Alamat */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Alamat</label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Tombol */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Menyiapkan..." : "Lanjut ke Anamnesa ➜"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/pasien")}
              className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
            >
              Kembali
            </button>
          </div>
        </form>
      </div>


    </div>
  );
}
