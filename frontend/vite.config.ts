import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// PWA
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "NewLearn",
        short_name: "NewLearn",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-64x64.png", // 절대 경로로 수정
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "/pwa-192x192.png", // 절대 경로로 수정
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png", // 절대 경로로 수정
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/maskable-icon-512x512.png", // 절대 경로로 수정
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      types: path.resolve(__dirname, "./src/types"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@store": path.resolve(__dirname, "./src/store"),
    },
  },
});
