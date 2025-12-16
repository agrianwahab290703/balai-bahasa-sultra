import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react({
            jsxRuntime: 'automatic',
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        open: false,
        https: false, // Explicitly disable HTTPS
        cors: true,
        hmr: {
            host: '10.10.152.83',
            port: 5173,
            protocol: 'ws', // Use WebSocket (not WSS)
            clientPort: 5173,
            overlay: true,
        },
        watch: {
            usePolling: true,
            interval: 100,
            ignored: ['!**/node_modules/**', '!**/vendor/**'],
        },
    },
    esbuild: {
        drop: ['console', 'debugger'],
    },
    build: {
        manifest: 'manifest.json',
        outDir: 'public/build',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'framer-motion'],
                    inertia: ['@inertiajs/react', '@inertiajs/progress'],
                    ui: [
                        '@radix-ui/react-accordion',
                        '@radix-ui/react-checkbox',
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-label',
                        '@radix-ui/react-navigation-menu',
                        '@radix-ui/react-scroll-area',
                        '@radix-ui/react-select',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-slot'
                    ],
                    forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
                    animation: ['embla-carousel-react', 'embla-carousel-autoplay', 'embla-carousel-fade'],
                    utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
                    icons: ['lucide-react', 'hugeicons-react'],
                },
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
        chunkSizeWarningLimit: 1500,
        target: 'esnext',
    },
    optimizeDeps: {
        include: ['react', 'react-dom', '@inertiajs/react'],
    },
});
