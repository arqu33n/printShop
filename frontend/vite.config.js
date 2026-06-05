import { defineConfig } from 'vite'
import path from 'path'
import babel from 'vite-plugin-babel'

export default defineConfig({
  root: path.resolve(__dirname),

  plugins: [
    babel({
      babelConfig: {
        plugins: ['@babel/plugin-transform-flow-strip-types'],
      },
      filter: /src\/.*\.(js|jsx)$/,
    }),
  ],

  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '@css': path.resolve(__dirname, 'src/css'),
      '@application': path.resolve(__dirname, 'src/application'),
      '@layout': path.resolve(__dirname, 'src/layout'),
      '@component': path.resolve(__dirname, 'src/component'),
      '@const': path.resolve(__dirname, 'src/const'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@model': path.resolve(__dirname, 'src/model'),
      '@storeUtils': path.resolve(__dirname, 'src/utils'),
      '@managers': path.resolve(__dirname, 'src/managers'),
      '@provider': path.resolve(__dirname, 'src/provider'),
      '@services': path.resolve(__dirname, 'src/provider/services'),
      '@pull': path.resolve(__dirname, 'src/provider/pull'),
      '@images': path.resolve(__dirname, 'src/images'),
      '@admin-images': path.resolve(__dirname, 'src/images/admin'),
      '@router': path.resolve(__dirname, 'src/router'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@helpers': path.resolve(__dirname, 'src/helpers/helpers'),
      '@errors': path.resolve(__dirname, 'src/helpers/errorMapper'),
    },
  },

  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    cors: true,
    proxy: {
      '/admin': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, ''),
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: path.resolve(__dirname, '../public'),
    assetsDir: 'assets',
    emptyOutDir: false,
    manifest: true,
    base: '/',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/application/main.js'),
        admin: path.resolve(__dirname, 'src/application/admin.js'),
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
