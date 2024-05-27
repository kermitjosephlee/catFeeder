import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), TanStackRouterVite()],
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
			"@components": path.resolve(__dirname, "src/components"),
		},
	},
});
