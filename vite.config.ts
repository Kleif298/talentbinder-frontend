import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      "~": "/src", // ~ → src für JS/TS und SCSS
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Globale SCSS-Datei in allen SCSS-Dateien einbinden
        additionalData: `@use "~/styles/global.scss";`,
      },
    },
  },
});
