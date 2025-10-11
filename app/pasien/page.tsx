"use client";
import React, { useState, useEffect } from "react";

interface Resep {
  obat: string;
  dosis: string;
  aturan: string;
}

interface Kunjungan {
  tanggal: string;
  keluhan: string;
  diagnosa: string;
  resep: Resep[];
  lab: string;
  hasilLab: string;
}

interface Pasien {
  id: number;
  noRM: string;
  nama: string;
  nik: string;
  alamat: string;
  tanggalLahir: string;
  umur: string;
  jenisKelamin: string;
  telepon: string;
  tipePasien: "Baru" | "Lama";
  riwayat: Kunjungan[];
}

export default function FarmasiPage() {
  const [pasien, setPasien] = useState<any>({
    noRM: "",
    nama: "",
    nik: "",
    alamat: "",
    tanggalLahir: "",
    umur: "",
    jenisKelamin: "",
    telepon: "",
    keluhan: "",
    diagnosa: "",
    resep: [{ obat: "", dosis: "", aturan: "" }],
    lab: "",
    hasilLab: "",
  });

  const [daftarPasien, setDaftarPasien] = useState<Pasien[]>([]);
  const [tipePasien, setTipePasien] = useState<"baru" | "lama" | "">("");
  const [searchRM, setSearchRM] = useState("");
  const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dataPasien") || "[]");
    setDaftarPasien(data);
  }, []);

  const getNextRM = () => {
    const lastRM = localStorage.getItem("lastRM");
    const next = lastRM ? parseInt(lastRM) + 1 : 1;
    localStorage.setItem("lastRM", next.toString());
    return `RM${next.toString().padStart(3, "0")}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPasien({ ...pasien, [name]: value });
  };

  const handleResepChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newResep = [...pasien.resep];
    newResep[index][name] = value;
    setPasien({ ...pasien, resep: newResep });
  };

  const tambahResep = () => {
    setPasien({
      ...pasien,
      resep: [...pasien.resep, { obat: "", dosis: "", aturan: "" }],
    });
  };

  const cariPasienLama = () => {
    const pasienFound = daftarPasien.find(p => p.noRM === searchRM);
    if (pasienFound) {
      setSelectedPasien(pasienFound);
      setPasien({
        ...pasienFound,
        keluhan: "",
        diagnosa: "",
        resep: [{ obat: "", dosis: "", aturan: "" }],
        lab: "",
        hasilLab: "",
      });
      alert("Pasien ditemukan 💙 Silakan isi kunjungan baru.");
    } else {
      alert("Pasien tidak ditemukan 😢");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const kunjunganBaru: Kunjungan = {
      tanggal: new Date().toLocaleDateString(),
      keluhan: pasien.keluhan,
      diagnosa: pasien.diagnosa,
      resep: pasien.resep,
      lab: pasien.lab,
      hasilLab: pasien.hasilLab,
    };

    if (tipePasien === "baru") {
      const noRM = getNextRM();
      const pasienBaru: Pasien = {
        id: daftarPasien.length + 1,
        noRM,
        nama: pasien.nama,
        nik: pasien.nik,
        alamat: pasien.alamat,
        tanggalLahir: pasien.tanggalLahir,
        umur: pasien.umur,
        jenisKelamin: pasien.jenisKelamin,
        telepon: pasien.telepon,
        tipePasien: "Baru",
        riwayat: [kunjunganBaru],
      };
      const updatedDaftar = [...daftarPasien, pasienBaru];
      setDaftarPasien(updatedDaftar);
      localStorage.setItem("dataPasien", JSON.stringify(updatedDaftar));
      alert(`Pasien baru tersimpan 💖 No. RM: ${noRM}`);
    } else if (tipePasien === "lama" && selectedPasien) {
      const updatedPasien: Pasien = {
        ...selectedPasien,
        riwayat: [...selectedPasien.riwayat, kunjunganBaru],
      };
      const updatedDaftar = daftarPasien.map(p => (p.noRM === updatedPasien.noRM ? updatedPasien : p));
      setDaftarPasien(updatedDaftar);
      localStorage.setItem("dataPasien", JSON.stringify(updatedDaftar));
      alert(`Kunjungan pasien lama berhasil ditambahkan 💙 No. RM: ${updatedPasien.noRM}`);
    }

    setPasien({
      noRM: "",
      nama: "",
      nik: "",
      alamat: "",
      tanggalLahir: "",
      umur: "",
      jenisKelamin: "",
      telepon: "",
      keluhan: "",
      diagnosa: "",
      resep: [{ obat: "", dosis: "", aturan: "" }],
      lab: "",
      hasilLab: "",
    });
    setSelectedPasien(null);
    setTipePasien("");
    setSearchRM("");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-6">
          🏥 Registrasi Pasien
        </h1>

        {tipePasien === "" && (
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              Pilih tipe pasien
            </h2>
            <div className="flex justify-center gap-4">
              <button onClick={() => setTipePasien("baru")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Pasien Baru
              </button>
              <button onClick={() => setTipePasien("lama")} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Pasien Lama
              </button>
            </div>
          </div>
        )}

        {tipePasien === "lama" && !selectedPasien && (
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Masukkan No. RM"
              value={searchRM}
              onChange={(e) => setSearchRM(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button onClick={cariPasienLama} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Cari
            </button>
          </div>
        )}

        {(tipePasien === "baru" || (tipePasien === "lama" && selectedPasien)) && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Identitas */}
            <div>
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Identitas Pasien</h2>
              <input name="nama" placeholder="Nama Lengkap" value={pasien.nama} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
              <input name="nik" placeholder="NIK" value={pasien.nik} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
              <input name="alamat" placeholder="Alamat" value={pasien.alamat} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
              <input name="tanggalLahir" placeholder="Tanggal Lahir" value={pasien.tanggalLahir} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
              <input name="umur" placeholder="Umur" value={pasien.umur} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
              <select name="jenisKelamin" value={pasien.jenisKelamin} onChange={handleChange} className="border p-2 rounded w-full mb-2">
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              <input name="telepon" placeholder="Telepon" value={pasien.telepon} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>

            {/* Diagnosa & Resep */}
            <div>
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Kunjungan & Resep</h2>
              <textarea name="keluhan" placeholder="Keluhan" value={pasien.keluhan} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
              <textarea name="diagnosa" placeholder="Diagnosa" value={pasien.diagnosa} onChange={handleChange} className="border p-2 rounded w-full mb-2" />

              <h3 className="font-semibold text-blue-700 mt-2 mb-1">Resep Obat</h3>
              {pasien.resep.map((r: Resep, i: number) => (
                <div key={i} className="bg-gray-50 border rounded p-2 mb-2">
                  <input name="obat" placeholder="Nama Obat" value={r.obat} onChange={(e) => handleResepChange(i, e)} className="border p-1 rounded w-full mb-1" />
                  <input name="dosis" placeholder="Dosis" value={r.dosis} onChange={(e) => handleResepChange(i, e)} className="border p-1 rounded w-full mb-1" />
                  <input name="aturan" placeholder="Aturan Pakai" value={r.aturan} onChange={(e) => handleResepChange(i, e)} className="border p-1 rounded w-full" />
                </div>
              ))}
              <button type="button" onClick={tambahResep} className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 mb-2">
                + Tambah Obat
              </button>

              <input name="lab" placeholder="Jenis Pemeriksaan Lab" value={pasien.lab} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
              <textarea name="hasilLab" placeholder="Hasil Lab" value={pasien.hasilLab} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>

            <div className="col-span-2 flex justify-center mt-4">
              <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">
                Simpan Data Pasien
              </button>
            </div>
          </form>
        )}
      </div>

      {/* TABEL DATA */}
      <div className="w-full max-w-6xl mt-8 overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 border">No. RM</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">NIK</th>
              <th className="p-2 border">Alamat</th>
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Diagnosa</th>
              <th className="p-2 border">Resep</th>
            </tr>
          </thead>
          <tbody>
            {daftarPasien.flatMap((p) =>
              (p.riwayat || []).map((r, i) => (
                <tr key={`${p.noRM}-${i}`} className="border text-center bg-gray-50 hover:bg-gray-100">
                  <td className="border p-2">{p.noRM}</td>
                  <td className="border p-2">{p.nama}</td>
                  <td className="border p-2">{p.nik}</td>
                  <td className="border p-2">{p.alamat}</td>
                  <td className="border p-2">{r.tanggal}</td>
                  <td className="border p-2">{r.diagnosa}</td>
                  <td className="border p-2">
                    {r.resep.map((res, idx) => (
                      <div key={idx}>{`${res.obat} (${res.dosis})`}</div>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
