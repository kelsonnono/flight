import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Plain client-side SPA: `vite build` emits a static site to dist/.
// Deep links (/app, /auth, /signup) are served index.html by the host's SPA fallback
// (see vercel.json); `vite dev` and `vite preview` already fall back to index.html.
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "dist",
  },
});
