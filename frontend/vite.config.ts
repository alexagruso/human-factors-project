import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "$lib/scss/global.scss" as *;`,
            },
        },
    },
    plugins: [sveltekit()],
    preview: {
        port: 5000,
        strictPort: false,
    },
    server: {
        proxy: {
            "/api": {
                target: "http://backend:3000",
            }, //anything with /api in url is proxied
        },
        port: 5000,
        strictPort: false,
    },
    test: {
        include: ["src/**/*.{test,spec}.{js,ts}"],
    },
});
