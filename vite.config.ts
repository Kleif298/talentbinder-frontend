import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3022,
    host: true,
    allowedHosts: [
      'localhost',
      '.onrender.com',
      'talentbinder.sunrise-avengers.ch',
      'talentbinder.lab.local.ch'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3023',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    port: 3022,
    host: true
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
