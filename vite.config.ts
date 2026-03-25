import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    env: {
      VITE_API_BASE_URL: "http://localhost:3000",
    },
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
  },
});
