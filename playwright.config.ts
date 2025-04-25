import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e",
    testMatch: "**/*.spec.ts",
    use: {
        headless: true,
        viewport: { width: 1280, height: 720 },
    },
    reporter: "list",
});
