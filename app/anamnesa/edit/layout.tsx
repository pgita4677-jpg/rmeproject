"use client";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Suspense akan “melindungi” useSearchParams di client component kamu
  return <Suspense fallback={<div>Memuat halaman...</div>}>{children}</Suspense>;
}
