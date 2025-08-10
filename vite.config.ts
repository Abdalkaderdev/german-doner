import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    ViteImageOptimizer({
      // Sensible defaults for large photos
      jpg: { quality: 70, progressive: true },
      jpeg: { quality: 70, progressive: true },
      png: { quality: 70 },
      webp: { quality: 70 },
      avif: { cqLevel: 33 },
      // Resize very large images to a max width for faster delivery
      // leaving original ext so our imports work; plugin writes optimized files
      maxWidth: 1400,
      maxHeight: 1400,
      preserveAspectRatio: true,
      overrideURL: false,
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
