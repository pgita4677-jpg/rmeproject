"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    passwordLama: "",
    passwordBaru: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    setForm((prev) => ({
      ...prev,
      nama: parsed.username || "",
      email: parsed.email || "",
    }));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user?.id,
          nama: form.nama,
          email: form.email,
          passwordLama: form.passwordLama,
          passwordBaru: form.passwordBaru,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("✅ " + data.message);

        const updatedUser = { ...user, username: form.nama, email: form.email };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setForm({ ...form, passwordLama: "", passwordBaru: "" });
      } else {
        toast.error("⚠️ " + data.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <Toaster position="top-right" richColors />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          ⚙️ Pengaturan Akun
        </h1>

        {/* Info Akun */}
        <Card className="mb-6 shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700 text-lg font-semibold">
              <User className="w-5 h-5 text-blue-500" /> Info Akun Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Username
              </label>
              <Input value={user?.username || "-"} readOnly className="bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Role
              </label>
              <Input value={user?.role || "User"} readOnly className="bg-gray-100" />
            </div>
          </CardContent>
        </Card>

        {/* Form Update */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700 text-lg font-semibold">
              <Lock className="w-5 h-5 text-green-500" /> Ubah Data Akun
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nama Baru
                </label>
                <Input
                  name="nama"
                  type="text"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama baru"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Baru
                </label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contoh@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password Lama
                </label>
                <Input
                  name="passwordLama"
                  type="password"
                  value={form.passwordLama}
                  onChange={handleChange}
                  placeholder="Masukkan password lama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password Baru
                </label>
                <Input
                  name="passwordBaru"
                  type="password"
                  value={form.passwordBaru}
                  onChange={handleChange}
                  placeholder="Masukkan password baru"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
