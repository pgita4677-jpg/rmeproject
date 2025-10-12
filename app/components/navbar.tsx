'use client'
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import Link from 'next/link';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">RME Project</div>
      
      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-6">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/pasien">Pasien</Link></li>
        <li><Link href="/about">About</Link></li>
      </ul>

      {/* Mobile Menu Button */}
      <div className="md:hidden cursor-pointer" onClick={() => setOpen(!open)}>
        {open ? <HiX size={28}/> : <HiMenu size={28}/>}
      </div>

      {/* Mobile Menu */}
      {open && (
        <ul className="absolute top-16 left-0 w-full bg-blue-500 flex flex-col gap-4 p-4 md:hidden">
          <li><Link href="/" onClick={() => setOpen(false)}>Home</Link></li>
          <li><Link href="/pasien" onClick={() => setOpen(false)}>Pasien</Link></li>
          <li><Link href="/about" onClick={() => setOpen(false)}>About</Link></li>
        </ul>
      )}
    </nav>
  );
}
