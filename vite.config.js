import { defineConfig } from 'vite';

// Timestamp suffix → her build'de benzersiz dosya adı → tarayıcı cache problemi yok
const buildStamp = Date.now().toString(36).slice(-5);

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash]-${buildStamp}.js`,
        chunkFileNames: `assets/[name]-[hash]-${buildStamp}.js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.(png|jpg|jpeg|gif|svg|webp)$/.test(assetInfo.name)) {
            return `assets/[name]-[hash].[ext]`;
          }
          return `assets/[name]-[hash]-${buildStamp}.[ext]`;
        }
      }
    }
  }
});
