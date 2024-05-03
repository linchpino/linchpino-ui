/** @type {import('next').NextConfig} */
const nextConfig = {
        output: 'standalone',
        async rewrites() {
                return [
                        {
                                source: '/api/:path*',
                                destination: 'http://api-dev.linchpino.com:8081/:path*',
                        },
                ]
        },
};

export default nextConfig;
