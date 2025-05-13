
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // PWA plugin for production
    mode === 'production' && VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-styles',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'robots.txt', 'manifest.json'],
      manifest: {
        name: 'Memoria - Preserve Your Memories',
        short_name: 'Memoria',
        description: 'A social platform to capture, store, and share your special moments',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64',
            type: 'image/x-icon'
          }
        ],
        display: 'standalone',
        start_url: '/'
      }
    }),
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
