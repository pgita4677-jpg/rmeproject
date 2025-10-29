"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";

export default function SettingsPage() {
  const [form, setForm] = useState({
    email: "",
    nama: "",
    passwordLama: "",
    passwordBaru: "",
  });

  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("✅ " + data.message);
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

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <Toaster position="top-right" richColors />

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Pengaturan Akun
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 shadow-sm border rounded-xl"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <Input
              name="nama"
              type="text"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan nama kamu"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password Lama
            </label>
            <Input
              name="passwordLama"
              type="password"
              value={form.passwordLama}
              onChange={handleChange}
              placeholder="Masukkan password lama"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password Baru
            </label>
            <Input
              name="passwordBaru"
              type="password"
              value={form.passwordBaru}
              onChange={handleChange}
              placeholder="Masukkan password baru"
              required
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
      </div>
    </div>
  );
}
