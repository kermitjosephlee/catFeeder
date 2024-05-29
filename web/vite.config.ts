import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), TanStackRouterVite(), tsconfigPaths()],
	server: {
		port: 8080,
		// proxy: {
		//   node: {
		//     target: "http://localhost:3000",
		//     changeOrigin: false,
		//     rewrite: (path) => path.replace(/^\/node/, ""),
		//     secure: false,
		//   },
		// },
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"@/*": path.resolve(__dirname, "src/*"),
			"@assets": path.resolve(__dirname, "src/assets"),
			"@components": path.resolve(__dirname, "src/components"),
			"@contexts": path.resolve(__dirname, "src/contexts"),
			"@hooks": path.resolve(__dirname, "src/hooks"),
			"@types": path.resolve(__dirname, "src/types"),
			"@utils": path.resolve(__dirname, "src/utils"),
		},
	},
});
