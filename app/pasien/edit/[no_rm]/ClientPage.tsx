"use client";
import { useEffect, useState } from "react";

export default function ClientPage({ no_rm }: { no_rm: string }) {
  const [pasien, setPasien] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPasien = async () => {
      try {
        const res = await fetch(`/api/pasien/${no_rm}`);
        const data = await res.json();
        setPasien(data);
      } catch (err) {
        console.error("Gagal mengambil data pasien", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPasien();
  }, [no_rm]);

  if (loading) return <div>Loading...</div>;
  if (!pasien) return <div>Data pasien tidak ditemukan.</div>;

  return <div>Data pasien: {pasien.nama}</div>;
}
