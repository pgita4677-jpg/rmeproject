"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function DetailPasien() {
  const { no_rm } = useParams();
  const [pasien, setPasien] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // 🔹 Ambil data pasien dari API
  const fetchPasien = async () => {
    try {
      const res = await fetch(`/api/pasien/${no_rm}`);
      const data = await res.json();
      if (data.success) {
        setPasien(data.data);
        setFormData(data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data pasien:", err);
    }
  };

  useEffect(() => {
    if (no_rm) fetchPasien();
  }, [no_rm]);

  // 🔹 Update form saat user ubah input
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Simpan perubahan ke database
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/pasien/${no_rm}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        alert("✅ Data pasien berhasil diperbarui!");
        await fetchPasien(); // 🔁 ambil ulang data terbaru
        setIsEditing(false);
      } else {
        alert("Gagal update pasien: " + result.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan saat update data pasien.");
    }
  };

  if (!pasien) return <p className="p-4">🔄 Memuat data pasien...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">🧾 Data Pasien</h2>

      <div className="grid grid-cols-2 gap-4">
        {["no_rm", "nama", "tanggal_lahir", "usia", "jenis_kelamin", "no_hp", "alamat"].map(
          (field) => (
            <div key={field}>
              <label className="font-medium block mb-1 capitalize">
                {field.replace("_", " ")}
              </label>
              {isEditing ? (
                <input
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="border rounded-md w-full p-2"
                />
              ) : (
                <p className="border rounded-md w-full p-2 bg-gray-100">
                  {pasien[field] || "-"}
                </p>
              )}
            </div>
          )
        )}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              💾 Simpan
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              ❌ Batal
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            ✏️ Edit
          </button>
        )}
      </div>
    </div>
  );
}
