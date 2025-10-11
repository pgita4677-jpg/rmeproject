// app/layout.tsx
import "./globals.css";
import React from "react";

export const metadata = {
  title: "My Project",
  description: "Website Next.js dengan Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        {/* 🌟 Konten utama */}
        <main className="flex-grow">{children}</main>

        {/* 🌙 Footer global */}
        <footer className="bg-gray-900 text-white py-4 text-center">
          <p className="text-sm">
            © 2025 My Project. All rights reserved. |{" "}
            <a
              href="mailto:kontak@myproject.com"
              className="text-blue-400 hover:underline"
            >
              Hubungi Kami
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
