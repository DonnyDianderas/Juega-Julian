import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  resolve: {
    extensions: ['.js', '.mjs', '.json', '.html'],},
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        math: resolve(__dirname, "src/math/index.html"),
        read: resolve(__dirname, "src/read/index.html"),
      },
    },
  },
});