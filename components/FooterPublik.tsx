export default function FooterPublik() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Sistem Rekam Medis Elektronik — Versi Publik.
      </div>
    </footer>
  )
}
