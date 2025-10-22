"use client"

import { useParams } from "next/navigation"

export default function ClinicDashboard() {
  const { clinic_id } = useParams()

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Dashboard Klinik {clinic_id}
        </h1>
        <p className="text-gray-600">
          Selamat datang di sistem RME Klinik {clinic_id}.
        </p>
      </div>
    </div>
  )
}
