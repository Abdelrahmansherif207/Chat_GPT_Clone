/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: 10 * 1024 * 1024, // 10MB
        },
    },
};

module.exports = nextConfig;
