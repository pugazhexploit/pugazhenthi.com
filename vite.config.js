import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'Authorization'],
  assetsInclude: ['**/*.glb'],
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@react-three/rapier') || id.includes('@dimforge/rapier3d-compat')) {
            return 'rapier-physics';
          }
          if (id.includes('@react-three') || id.includes('meshline')) {
            return 'react-three-drei';
          }
          if (id.includes('three')) {
            return 'three-core';
          }
          if (id.includes('ogl')) {
            return 'ogl-webgl';
          }
        },
      },
    },
  },
})
