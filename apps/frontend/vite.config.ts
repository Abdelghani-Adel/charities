import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "api-contracts": "/packages/api-contracts/src",
      shared: "/packages/shared/src",
      config: "/packages/config/src",
    },
  },
});
