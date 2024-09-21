/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'static.wikia.nocookie.net', // The domain you want to allow
        },
        {
          protocol: 'https',
          hostname: 'cdn.wanderer.moe', // Another domain you want to allow
        },
      ],
    },
  };
  
  export default nextConfig;