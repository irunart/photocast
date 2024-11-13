import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// import postcsspxtoviewport from "postcss-px-to-viewport";
// import proxy from './proxy';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: "PC_",
  base: process.env.PC_BASE ?? "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {},
});
