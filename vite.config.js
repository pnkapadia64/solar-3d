import { defineConfig } from "vite";

export default defineConfig({
  base: "/solar-3d/",
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
