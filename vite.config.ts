
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    build: {
      target: ['es2020'],
      outDir: 'build',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true,
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'radix-ui': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-aspect-ratio',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-collapsible',
              '@radix-ui/react-context-menu',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-hover-card',
              '@radix-ui/react-label',
              '@radix-ui/react-menubar',
              '@radix-ui/react-navigation-menu',
              '@radix-ui/react-popover',
              '@radix-ui/react-progress',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slider',
              '@radix-ui/react-slot',
              '@radix-ui/react-switch',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toggle',
              '@radix-ui/react-toggle-group',
              '@radix-ui/react-tooltip',
            ],
            'vendor': [
              'react',
              'react-dom',
              'react-hook-form',
              'react-resizable-panels',
              'react-day-picker',
            ],
            'charts': [
              'recharts',
            ],
            'ui-utils': [
              'sonner',
              'cmdk',
              'class-variance-authority',
              'tailwind-merge',
              'clsx',
              'motion',
              'vaul',
              'next-themes',
              'lucide-react',
              'input-otp',
              'embla-carousel-react',
            ],
          },
        },
      },
      cssCodeSplit: true,
      sourcemap: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 500,
    },
    server: {
      port: 3000,
      open: false,
      strictPort: false,
      cors: true,
    },
    preview: {
      port: 4173,
      strictPort: false,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@radix-ui/react-dialog',
        '@radix-ui/react-tabs',
        '@radix-ui/react-slot',
        'lucide-react',
        'recharts',
      ],
      exclude: ['build'],
    },
  });