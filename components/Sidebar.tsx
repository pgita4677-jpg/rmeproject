// components/Sidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Stethoscope, Pill, BarChart3, LogOut, ChevronLeft, Menu } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ onLogout }: { onLogout?: () => void }) {
  const router = useRouter();
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { title: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, link: "/dashboard" },
    { title: "Pasien", icon: <Users className="w-5 h-5" />, link: "/pasien" },
    { title: "Rekam Medis", icon: <Stethoscope className="w-5 h-5" />, link: "/rekam-medis" },
    { title: "Farmasi", icon: <Pill className="w-5 h-5" />, link: "/farmasi" },
    { title: "Laporan", icon: <BarChart3 className="w-5 h-5" />, link: "/laporan" },
  ];

  return (
    <aside className={`sidebar flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="text-blue-600 font-bold text-lg">{collapsed ? "R" : "RME System"}</div>
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500">
          {collapsed ? <Menu /> : <ChevronLeft />}
        </button>
      </div>

      <nav className="p-3 flex-1 space-y-1">
        {items.map((it) => {
          const active = path === it.link;
          return (
            <button
              key={it.title}
              onClick={() => router.push(it.link)}
              className={`sidebar-btn ${active ? "active" : ""} ${collapsed ? "justify-center" : ""}`}
            >
              <span>{it.icon}</span>
              {!collapsed && <span>{it.title}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <button
          onClick={() => { onLogout?.(); }}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition`}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
