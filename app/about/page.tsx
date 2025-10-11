import React from "react";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-8">
      {/* Judul */}
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-3">
          Tentang Kami
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Kami adalah tim yang berkomitmen menghadirkan pengalaman digital terbaik —
          mengutamakan kualitas, kenyamanan, dan tampilan yang menarik untuk setiap pengguna.
        </p>
      </div>

      {/* Gambar / Ilustrasi */}
      <div className="mb-10 animate-fadeInUp animation-delay-200">
        <Image
          src="/team.svg"
          alt="Ilustrasi tim"
          width={260}
          height={260}
          className="rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Kartu Informasi */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full px-4">
        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 animate-fadeInUp animation-delay-300">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Misi Kami</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Memberikan solusi digital yang bermanfaat dan inovatif untuk membantu
            pengguna mencapai tujuan mereka secara efisien.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 animate-fadeInUp animation-delay-400">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Nilai Kami</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Kami menjunjung tinggi kejujuran, kerja tim, dan kreativitas untuk
            menciptakan hasil yang bermakna dan berkelanjutan.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 animate-fadeInUp animation-delay-500">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Tujuan Kami</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Membangun aplikasi yang mudah digunakan, cepat, dan dapat memberikan
            pengalaman terbaik bagi setiap pengguna.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-sm animate-fadeInUp animation-delay-600">
        © {new Date().getFullYear()} My Next.js App — Dibuat dengan ❤️ oleh Tim Kami
      </footer>
    </div>
  );
}
