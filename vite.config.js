import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({

  plugins: [
    react()
  ],

  test: {

    environment: "jsdom",

    setupFiles: ["./src/test/setup.js"],

    include: [
      "src/**/*.test.{js,jsx,ts,tsx}"
    ],

    exclude: [
      "node_modules",
      "dist",
      "backend"
    ],

    coverage: {
      provider: "v8",

      reporter: [
        "text",
        "html"
      ],

      include: [
        "src/**/*.{js,jsx,ts,tsx}"
      ],

      exclude: [
        "src/**/*.test.{js,jsx,ts,tsx}",
        "src/test/**",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/assets/**"
      ],

      thresholds: {
        lines: 15,
        functions: 20,
        branches: 10,
        statements: 15
      }
    }

  }

});