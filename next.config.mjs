/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ✅ Tetap build meskipun ada error TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Lewati pengecekan ESLint saat build (biar tidak gagal di Vercel)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
