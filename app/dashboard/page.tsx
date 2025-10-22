"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"
import { LayoutDashboard, Users, Stethoscope, Pill, BarChart3, LogOut } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 🔹 Ambil data user dari localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/login")
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return <p className="p-10 text-gray-600">Memuat...</p>
  }

  if (!user) {
    return null
  }

  // 🔹 Fungsi logout (hapus token & user)
  const handleLogout = async () => {
    try {
      // Hapus cookie di server
      await fetch("/api/logout", { method: "POST" })
    } catch {}
    // Hapus localStorage
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard RME</h1>
      <p className="text-gray-600 mt-2">
        Hai, <span className="font-semibold">{user?.username}</span> 👋
      </p>

      {/* 🔹 Grid menu utama */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card
          className="cursor-pointer hover:shadow-lg transition"
          onClick={() => router.push("/pasien")}
        >
          <CardHeader className="flex flex-row items-center space-x-2">
            <Users className="text-blue-500" />
            <CardTitle>Pasien</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">Kelola data pasien di sini.</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition"
          onClick={() => router.push("/rekam-medis")}
        >
          <CardHeader className="flex flex-row items-center space-x-2">
            <Stethoscope className="text-green-500" />
            <CardTitle>Rekam Medis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">Kelola data rekam medis di sini.</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition"
          onClick={() => router.push("/farmasi")}
        >
          <CardHeader className="flex flex-row items-center space-x-2">
            <Pill className="text-yellow-500" />
            <CardTitle>Farmasi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">Kelola data farmasi di sini.</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition"
          onClick={() => router.push("/laporan")}
        >
          <CardHeader className="flex flex-row items-center space-x-2">
            <BarChart3 className="text-purple-500" />
            <CardTitle>Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">Kelola data laporan di sini.</p>
          </CardContent>
        </Card>
      </div>

      <button
        onClick={handleLogout}
        className="mt-10 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Keluar</span>
      </button>
    </div>
  )
}
