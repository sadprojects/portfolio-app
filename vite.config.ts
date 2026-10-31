import path from 'path';

import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig, lazyPlugins } from 'vite-plus';

const alias = Object.fromEntries(
  Object.entries({
    '@': 'src',
    '@components': 'src/components',
    '@contexts': 'src/contexts',
    '@data': 'src/data',
    '@hooks': 'src/hooks',
    '@pages': 'src/pages',
    '@sections': 'src/sections',
    '@styles': 'src/styles',
    '@utils': 'src/utils',
    '@lib': 'src/lib',
  }).map(([k, v]) => [k, path.resolve(import.meta.dirname, v)]),
);

// Vendor chunks keyed by package so a content change doesn't bust the whole bundle cache.
const chunks: Record<string, RegExp> = {
  vendor: /node_modules\/(react|react-dom|scheduler)\//,
  styled: /node_modules\/styled-components\//,
  animation: /node_modules\/framer-motion\//,
  icons: /node_modules\/lucide-react\//,
};

// https://viteplus.dev/guide/
export default defineConfig({
  lint: {
    plugins: ['oxc', 'typescript', 'unicorn', 'react'],
    categories: { correctness: 'error' },
    env: { builtin: true, browser: true, es2020: true },
    ignorePatterns: ['dist', 'node_modules', '*.config.js', '*.config.ts'],
    rules: {
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'typescript/no-explicit-any': 'warn',
      'react/exhaustive-deps': 'warn',
      'react/only-export-components': ['warn', { allowConstantExport: true }],
      'vite-plus/prefer-vite-plus-imports': 'error',
      // React Compiler + type-aware rules ESLint never ran here; warn until the call sites are fixed.
      'react/set-state-in-effect': 'warn',
      'react/refs': 'warn',
      'react/purity': 'warn',
      'typescript/unbound-method': 'off',
      // Effects start async work and let the promise go by design; `void` would only hide that.
      'typescript/no-floating-promises': 'off',
    },
    options: { typeAware: true, typeCheck: true },
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
  },
  fmt: { singleQuote: true, printWidth: 80, sortImports: true },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/', '**/*.d.ts', '**/types.ts', '**/*.test.{ts,tsx}'],
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
  plugins: lazyPlugins(() => [
    react({
      babel: {
        plugins: [
          // Coverage would count the compiler's memo-cache branches as code, so tests skip it.
          ...(process.env.VITEST ? [] : [['babel-plugin-react-compiler']]),
          [
            'babel-plugin-styled-components',
            { displayName: true, fileName: true },
          ],
        ],
      },
    }),
    svgr({ svgrOptions: { icon: true } }),
  ]),
  resolve: { alias },
  server: { port: 3000 },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) =>
          Object.keys(chunks).find((name) => chunks[name].test(id)),
      },
    },
  },
});
