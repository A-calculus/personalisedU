/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Handle environment variables properly
  env: {
    // Add any public environment variables here
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Basic configuration
  reactStrictMode: true,
};

module.exports = nextConfig; 