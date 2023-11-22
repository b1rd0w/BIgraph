const withPWA = require("@ducanh2912/next-pwa").default({
	dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	typescript: {
		ignoreBuildErrors: true,
	},
	experimental: {
		serverActions: {
			bodySizeLimit: '4mb',
		},
	},
}

module.exports = withPWA(nextConfig);