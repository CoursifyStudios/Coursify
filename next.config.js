/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			"hhrehffmdrcjqowwvgqg.supabase.co",
			"cdn.coursify.one",
			"lh3.googleusercontent.com",
			"cdn.discordapp.com",
			"media.discordapp.net",
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
