import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [sveltekit()],
    test: {
        include: ["src/**/*.{test,spec}.{js,ts}"],
    },
    server: {
        proxy: {
            "/api": "http://localhost:3000", //anything with /api in url is proxied
        },
        port: 5000,
        strictPort: false,
    },
    preview: {
        port: 5000,
        strictPort: false,
    },
});
