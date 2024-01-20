import { sveltekit } from "@sveltejs/kit/vite";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 3001,
		host: "0.0.0.0"
	},
	resolve: {
		alias: {
			"@": path.resolve("src") // Styles in src/styles will be accessible as '@/styles/whatever.scss'
		}
	}
});
