"use client";

import { useRouter } from "next/navigation";
import { UserPlus, Users } from "lucide-react";

export default function PasienPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center pt-24 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-12 text-center">
        Pilih Jenis Pasien
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl w-full justify-items-center">
        {/* Pasien Baru */}
        <div
          onClick={() => router.push("/pasien/add")}
          className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-10 w-full md:w-80 flex flex-col items-center border border-blue-100"
        >
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <UserPlus className="text-green-600 w-10 h-10" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Pasien Baru
          </h2>
          <p className="text-gray-500 text-center text-sm">
            Input identitas & anamnesa pasien baru
          </p>
        </div>

        {/* Pasien Lama */}
        <div
          onClick={() => router.push("/pasien/select")}
          className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-10 w-full md:w-80 flex flex-col items-center border border-blue-100"
        >
          <div className="bg-blue-100 p-4 rounded-full mb-6">
            <Users className="text-blue-600 w-10 h-10" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Pasien Lama
          </h2>
          <p className="text-gray-500 text-center text-sm">
            Cari & pilih pasien yang sudah ada
          </p>
        </div>
      </div>
    </div>
  );
}
