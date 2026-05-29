import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: "@/components",
        replacement: path.resolve(__dirname, "./src/presentations/components"),
      },
      {
        find: "@/hooks",
        replacement: path.resolve(__dirname, "./src/presentations/hooks"),
      },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
});
