/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Enable build caching
  experimental: {
    // This enables build caching
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:10000'],
    },
  },
  // Ensure the app works on Render
  output: 'standalone',
  // Handle environment variables properly
  env: {
    // Add any public environment variables here
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Ensure proper production configuration
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

module.exports = nextConfig; 