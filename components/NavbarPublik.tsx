'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavbarPublik() {
  const pathname = usePathname()

  const links = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang', href: '/about' },
    { name: 'Login', href: '/login' },
  ]

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <h1 className="text-xl font-bold text-blue-600">Rekam Medis Elektronik</h1>

        <ul className="flex gap-6">
          {links.map(({ name, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium ${
                  pathname === href ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
