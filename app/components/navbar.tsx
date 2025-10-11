"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
export default function Navbar() {
  const pathname = usePathname();

  const menu = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Login", href: "/login" },
    { name: "Registrasi", href: "/registrasi" },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-lg font-bold tracking-wide">
          🌐 MyWebsite
        </h1>

        {/* Menu */}
        <ul className="flex gap-6">
          {menu.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`hover:underline underline-offset-4 transition ${
                  pathname === item.href ? "font-semibold text-yellow-300" : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
