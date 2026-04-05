/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ryp/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fcxyrebdegtjdsbasxfc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
