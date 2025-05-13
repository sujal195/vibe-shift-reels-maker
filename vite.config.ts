
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Bundle visualization for production builds
    mode === 'production' && visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable minification for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    },
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('lucide')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
          
          // Split app code by main features
          if (id.includes('/src/components/post/')) {
            return 'feature-posts';
          }
          if (id.includes('/src/components/auth/')) {
            return 'feature-auth';
          }
          if (id.includes('/src/components/profile/')) {
            return 'feature-profile';
          }
          if (id.includes('/src/pages/')) {
            return 'pages';
          }
        }
      }
    },
    // Generate source maps for production
    sourcemap: true,
    // Optimize CSS
    cssCodeSplit: true,
    // Add asset hashes for cache busting
    assetsInlineLimit: 4096
  },
  // Optimize CSS handling
  css: {
    devSourcemap: true,
    modules: {
      generateScopedName: mode === 'production' ? '[hash:base64:8]' : '[local]_[hash:base64:5]',
    }
  },
  // Improve code splitting
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js']
  },
  // Reduce initial load size
  esbuild: {
    legalComments: 'none',
    treeShaking: true
  }
}));
