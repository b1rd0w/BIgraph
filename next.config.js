/** @type {import('next').NextConfig} */
module.exports = {
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