"use client";
import { useEffect, useState } from "react";

export default function ClientPage({ no_rm }: { no_rm: string }) {
  const [pasien, setPasien] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPasien = async () => {
      try {
        const res = await fetch(`/api/pasien/${no_rm}`);
        if (!res.ok) throw new Error("Gagal fetch data pasien");
        const data = await res.json();
        setPasien(data);
      } catch (err) {
        console.error("❌ Gagal mengambil data pasien:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPasien();
  }, [no_rm]);

  if (loading) return <div>Loading...</div>;
  if (!pasien) return <div>Data pasien tidak ditemukan.</div>;

  return <DetailPasien pasien={pasien} />;
}

function DetailPasien({ pasien }: { pasien: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(pasien);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pasien/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Data pasien berhasil diperbarui!");
        setIsEditing(false);
        window.location.reload();
      } else {
        alert("❌ Gagal update data pasien: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server saat update data pasien.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">🧍 Data Pasien</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ✏️ Edit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <p><b>No. RM:</b> {pasien.no_rm}</p>
        <p><b>Nama:</b> {pasien.nama}</p>
        <p><b>Tanggal Lahir:</b> {pasien.tanggal_lahir}</p>
        <p><b>Usia:</b> {pasien.usia}</p>
        <p><b>Jenis Kelamin:</b> {pasien.jenis_kelamin}</p>
        <p><b>No. HP:</b> {pasien.no_hp}</p>
        <p className="col-span-2"><b>Alamat:</b> {pasien.alamat}</p>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Data Pasien</h3>

            <div className="space-y-3">
              <input
                name="nama"
                value={editData.nama || ""}
                onChange={handleChange}
                placeholder="Nama"
                className="w-full border p-2 rounded"
              />
              <input
                type="date"
                name="tanggal_lahir"
                value={editData.tanggal_lahir?.substring(0, 10) || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <select
                name="jenis_kelamin"
                value={editData.jenis_kelamin || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
              <input
                name="no_hp"
                value={editData.no_hp || ""}
                onChange={handleChange}
                placeholder="No HP"
                className="w-full border p-2 rounded"
              />
              <textarea
                name="alamat"
                value={editData.alamat || ""}
                onChange={handleChange}
                placeholder="Alamat"
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
