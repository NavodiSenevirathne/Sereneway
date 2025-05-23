import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path
      },
    },
  },

  plugins: [react()],
});
