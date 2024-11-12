import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: "standalone",
    compress: true,

};

const withAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true'
});

export default withNextIntl(withAnalyzer(nextConfig));
