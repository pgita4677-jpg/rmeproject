import React, { JSX } from 'react'

export default function About():JSX.Element {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">About Us</h1>
      <p className="text-lg text-gray-700 max-w-2xl">
        Ini adalah halaman <strong>About</strong>.  
        Di sini kamu bisa menuliskan informasi tentang website atau tim kamu.
      </p>
    </div>
  );
}