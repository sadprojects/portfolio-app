import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

function copyAssetsPlugin() {
  return {
    name: 'copy-assets',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'src/assets');
      const destDir = path.resolve(__dirname, 'dist/src/assets');

      function copyRecursive(src: string, dest: string) {
        if (!statSync(src).isDirectory()) {
          mkdirSync(path.dirname(dest), { recursive: true });
          copyFileSync(src, dest);
          return;
        }

        mkdirSync(dest, { recursive: true });
        readdirSync(src).forEach((file) => {
          const srcPath = path.join(src, file);
          const destPath = path.join(dest, file);
          copyRecursive(srcPath, destPath);
        });
      }

      copyRecursive(srcDir, destDir);
      console.log('✓ Copied assets to dist/src/assets');
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler'],
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: true,
            },
          ],
        ],
      },
    }),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
    copyAssetsPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@data': path.resolve(__dirname, './src/data'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@models': path.resolve(__dirname, './src/models'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          styled: ['styled-components'],
          animation: ['framer-motion'],
          icons: ['lucide-react'],
          dates: ['date-fns'],
        },
      },
    },
  },
  // Pre-bundle these deps for faster dev server startup
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'styled-components',
      'framer-motion',
      'date-fns',
    ],
  },
});
