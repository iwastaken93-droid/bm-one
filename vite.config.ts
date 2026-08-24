import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  // Prevent Vite from obscuring Rust errors
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // Ignore Rust build artifacts so Node fs.watch never locks on compiler DLLs
      ignored: ["**/src-tauri/**", "**/target/**"]
    }
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: true
  }
});
