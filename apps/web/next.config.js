/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [new URL("https://flagcdn.com/**")],
	},
};

export default nextConfig;
