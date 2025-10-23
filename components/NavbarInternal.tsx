"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Pill,
  BarChart3,
  LogOut,
} from "lucide-react";

export default function NavbarInternal() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pasien", href: "/pasien", icon: Users },
    { name: "Rekam Medis", href: "/rekam-medis", icon: Stethoscope },
    { name: "Farmasi", href: "/farmasi", icon: Pill },
    { name: "Laporan", href: "/laporan", icon: BarChart3 },
  ];

  // 🔹 Logout manual
  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/;";
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* 🔹 Left side (logo + nav links) */}
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-semibold text-blue-600 tracking-wide select-none">
            🏥 RME System
          </h1>

          <ul className="hidden md:flex items-center gap-6">
            {navItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-2 px-2 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={17} /> {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 🔹 Right side (logout) */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
