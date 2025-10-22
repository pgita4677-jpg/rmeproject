'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Stethoscope, Pill, BarChart3, LogOut } from 'lucide-react'

export default function NavbarInternal() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Pasien', href: '/pasien', icon: Users },
    { name: 'Rekam Medis', href: '/rekam-medis', icon: Stethoscope },
    { name: 'Farmasi', href: '/farmasi', icon: Pill },
    { name: 'Laporan', href: '/laporan', icon: BarChart3 },
  ]

  // 🔹 Fungsi logout versi JWT custom
  const handleLogout = () => {
    // Hapus token dari cookie/localStorage
    localStorage.removeItem('token')
    document.cookie = 'token=; Max-Age=0; path=/;'

    // Redirect ke halaman login
    router.push('/login')
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold text-blue-600">RME Dashboard</h1>

          <ul className="flex items-center gap-5">
            {navItems.map(({ name, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2 text-sm font-medium ${
                    pathname === href
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  <Icon size={18} /> {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 text-sm"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  )
}
