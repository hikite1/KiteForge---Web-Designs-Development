import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  webServer: {
    command: "npx live-server --port=8080 --no-browser",
    port: 8080,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:8080",
  },
});
