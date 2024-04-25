import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
        alias: {
            "@components": "./src/lib/components",
            "@lib": "./src/lib",
        },
        csrf: {
            checkOrigin: false,
        },
    },
    onwarn: (warning, handler) => {
        const { code } = warning;

        if (code === "css-unused-selector") {
            return;
        }

        handler(warning);
    },
    preprocess: vitePreprocess(),
};

export default config;
