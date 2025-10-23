"use client";

import { usePathname } from "next/navigation";
import NavbarInternal from "./NavbarInternal";
import NavbarPublik from "./NavbarPublik";
import FooterInternal from "./FooterInternal";
import FooterPublik from "./FooterPublik";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Rute yang dianggap publik (tanpa navbar internal)
  const isPublicPage = ["/login", "/register", "/"].includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      {isPublicPage ? <NavbarPublik /> : <NavbarInternal />}

      {/* Konten utama */}
      <main className="flex-grow pt-16 pb-16">{children}</main>

      {/* Footer */}
      {isPublicPage ? <FooterPublik /> : <FooterInternal />}
    </div>
  );
}
