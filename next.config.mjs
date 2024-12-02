/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', 
                port: '', 
            },
            {
                protocol: 'http',
                hostname: '**', 
                port: '', 
            },
        ],
    },
    reactStrictMode: true,
};

export default nextConfig;
