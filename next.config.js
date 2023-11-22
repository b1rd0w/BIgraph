const withPWA = require("@ducanh2912/next-pwa").default({
	dest: "public",
	disable: process.env.NODE_ENV === "development",
	fallbacks: {
		document: "/~offline",
	},
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