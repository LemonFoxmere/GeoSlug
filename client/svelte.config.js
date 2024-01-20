import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath } from "node:url";
import path from "path";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess({
		style: {
			css: {
				preprocessorOptions: {
					scss: {
						importer: [
							(url) => {
								if (url.startsWith("$static")) {
									return {
										file: url.replace(/^\$static/, path.join(dirname, "static"))
									};
								}
								return url;
							}
						]
					}
				}
			}
		}
	}),

	onwarn: (warning, handler) => {
		if (warning.code === "css-unused-selector" || warning.code.startsWith("a11y-")) {
			return;
		}
		handler(warning);
	},

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),

		alias: {
			$static: "static",
			$comp: "$lib/comp",
			$route: "src/routes"
		}
	}
};

export default config;
