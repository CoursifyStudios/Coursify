/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: "/assignments",
				destination: "/assignments/0",
				permanent: false,
			},
			{
				source: "/classes",
				destination: "/classes/0",
				permanent: false,
			},
		];
	},
};

module.exports = nextConfig;
