/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // Prevent dual ag-grid-community copies (ModuleRegistry vs AgGridReact createGrid).
    dedupe: ["ag-grid-community", "ag-grid-react"],
  },
  optimizeDeps: {
    include: ["ag-grid-community", "ag-grid-react"],
  },
  server: {
    open: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    // Serial forks avoid Windows file-lock collisions across workers.
    pool: "forks",
    maxWorkers: 1,
    minWorkers: 1,
    env: {
      VITE_API_BASE_URL: "https://api.test/api/",
      VITE_PAYABLE_NOTES_ID: "00000000-0000-0000-0000-000000000001",
      VITE_RECEIVABLE_NOTES_ID: "00000000-0000-0000-0000-000000000002",
      VITE_APP_ENV: "test",
    },
  },
});
