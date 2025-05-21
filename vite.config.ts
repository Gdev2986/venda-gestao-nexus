
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // Use proper options that are recognized by TypeScript types
      jsxImportSource: 'react',
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Explicitly force single React instance resolution
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      // Add additional react-related packages to ensure they use the same React instance
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
    },
  },
  optimizeDeps: {
    // Force include React to ensure it's pre-bundled correctly
    include: [
      "react", 
      "react-dom", 
      "react/jsx-runtime", 
      "react/jsx-dev-runtime"
    ],
    // Force Vite to re-bundle React packages
    force: true
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
}));
