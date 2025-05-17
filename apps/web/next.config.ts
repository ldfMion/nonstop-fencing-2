import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [new URL("https://flagcdn.com/**")],
	},
};

export default nextConfig;
