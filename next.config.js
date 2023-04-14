/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			"hhrehffmdrcjqowwvgqg.supabase.co",
			"cdn.coursify.one",
			"lh3.googleusercontent.com",
		],
	},
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
