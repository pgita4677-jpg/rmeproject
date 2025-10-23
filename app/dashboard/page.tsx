"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Stethoscope, Pill, BarChart3, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  if (loading) return <p className="p-10 text-gray-600">Memuat...</p>;
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("user");
    router.push("/login");
  };

  const menu = [
    { title: "Pasien", icon: <Users className="w-6 h-6 text-blue-500" />, link: "/pasien", desc: "Kelola data pasien di sini." },
    { title: "Rekam Medis", icon: <Stethoscope className="w-6 h-6 text-green-500" />, link: "/rekam-medis", desc: "Kelola rekam medis di sini." },
    { title: "Farmasi", icon: <Pill className="w-6 h-6 text-yellow-500" />, link: "/farmasi", desc: "Kelola data farmasi di sini." },
    { title: "Laporan", icon: <BarChart3 className="w-6 h-6 text-purple-500" />, link: "/laporan", desc: "Kelola data laporan di sini." },
  ];

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto mb-10 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Dashboard RME</h1>
        <p className="text-gray-600 mt-2">
          Hai, <span className="font-semibold">{user?.username}</span> 👋
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {menu.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.5 }}
          >
            <Card
              className="cursor-pointer hover:shadow-xl transition p-6 rounded-xl bg-white"
              onClick={() => router.push(item.link)}
            >
              <CardHeader className="flex items-center space-x-3">
                {item.icon}
                <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
