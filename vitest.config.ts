import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.test.{ts,tsx}", "api/**/*.test.ts", "server/**/*.test.ts"],
      testTimeout: 10_000,
      coverage: {
        provider: "v8",
        reporter: ["text", "json-summary"],
        include: ["src/**/*.{ts,tsx}", "api/**/*.ts", "server/**/*.ts"],
        exclude: [
          "src/main.tsx",
          "src/**/*.test.{ts,tsx}",
          "src/test/**",
          "src/layouts/**",
          "src/components/Sidebar/**",
          "src/types/**",
        ],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  }),
);
